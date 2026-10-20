import * as React from 'react';

import { Loader, SegmentedButton, SegmentedItem, Toast } from '@/components/ui';
import type { ConsultationRequestStatus } from '@/features/secretary/api';
import { InboxDetailNav } from '@/features/secretary/components/inbox-detail-nav';
import { InboxDetails } from '@/features/secretary/components/inbox-details';
import { InboxEmpty } from '@/features/secretary/components/inbox-empty';
import { InboxList } from '@/features/secretary/components/inbox-list';
import { InboxProcessedList } from '@/features/secretary/components/inbox-processed-list';
import { InboxReminderList } from '@/features/secretary/components/inbox-reminder-list';
import { useInboxRequests, useUpdateRequestStatus } from '@/features/secretary/hooks';
import { getRequestTrackingProperties, toInboxTabName } from '@/features/secretary/lib/analytics';
import { formatInboxTimestamp } from '@/features/secretary/lib/format-inbox-timestamp';
import { isInboxRequestTreated } from '@/features/secretary/lib/inbox-status';
import type { InboxProcessReason } from '@/features/secretary/lib/process-reasons';
import type {
  InboxRequest,
  InboxRequestOutcome,
  InboxRequestStatus,
} from '@/features/secretary/types';
import { CheckCircleIcon } from '@/icons';
import { AnalyticsEvent, analytics } from '@/services';

const TABS: { value: InboxRequestStatus; label: string; emptyLabel: string }[] = [
  { value: 'new', label: 'Nouveau', emptyLabel: 'Aucune nouvelle demande' },
  { value: 'reminder', label: 'Rappel', emptyLabel: 'Aucun rappel' },
  { value: 'processed', label: 'Archive', emptyLabel: 'Aucune demande archivée' },
];

const TOAST_DURATION_MS = 4000;

/** "RDV validé" moves a request to "Traitée" as a validated appointment. */
function getStatusOutcome(status: InboxRequestStatus): InboxRequestOutcome | undefined {
  return status === 'processed' ? 'validated' : undefined;
}

interface InboxRequestOverride {
  status: InboxRequestStatus;
  outcome?: InboxRequestOutcome;
  reason?: InboxProcessReason;
  processedAt: string;
}

/** "A rappeler" → `reminder`; "RDV validé" / "Traitée" → the outcome (`validated` / `treated`). */
function toApiStatus(override: InboxRequestOverride): ConsultationRequestStatus {
  return override.outcome ?? 'reminder';
}

export function InboxView() {
  const { data, isPending, refetchTab } = useInboxRequests();
  const { mutate: updateStatus } = useUpdateRequestStatus();
  const [overrides, setOverrides] = React.useState<Record<string, InboxRequestOverride>>({});
  const [rawActiveTab, setRawActiveTab] = React.useState<InboxRequestStatus>('new');
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined);
  const [detailId, setDetailId] = React.useState<string | undefined>(undefined);
  const [toast, setToast] = React.useState<{ label: string } | null>(null);

  const requests = React.useMemo(() => {
    // The same request can come back from several tab queries while their caches are out of
    // sync after a status change; keep one copy per tab, including once an override moved it.

    const seen = new Set<string>();
    const result: InboxRequest[] = [];
    for (const request of data) {
      const override = overrides[request.id];
      const next = override
        ? {
            ...request,
            status: override.status,
            outcome: override.outcome,
            processReason: override.reason,
            processedAt: override.processedAt,
          }
        : request;
      const key = `${next.status}:${next.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(next);
    }
    return result;
  }, [data, overrides]);

  const tabCounts = React.useMemo(() => {
    const counts: Record<InboxRequestStatus, number> = { new: 0, reminder: 0, processed: 0 };
    for (const request of requests) counts[request.status] += 1;
    return counts;
  }, [requests]);

  const visibleTabs = TABS.filter(tab => tab.value === 'new' || tabCounts[tab.value] > 0);
  const activeTab = visibleTabs.some(tab => tab.value === rawActiveTab) ? rawActiveTab : 'new';

  const tabRequests = requests.filter(request => request.status === activeTab);
  const selectedRequest = tabRequests.find(request => request.id === selectedId) ?? tabRequests[0];
  const emptyLabel = TABS.find(tab => tab.value === activeTab)?.emptyLabel ?? '';
  const detailRequest = tabRequests.find(request => request.id === detailId);
  /** The request whose detail panel is on screen — "Nouveau" always shows one beside the list. */
  const viewedRequest = detailRequest ?? (activeTab === 'new' ? selectedRequest : undefined);
  const viewedRequestKey = viewedRequest
    ? `${viewedRequest.status}:${viewedRequest.id}`
    : undefined;

  // VIEW_SECRETARY_INBOX — once per inbox mount, as soon as the first load settles so
  // `new_request_count` is real (StrictMode-safe via the ref).
  const inboxViewTrackedRef = React.useRef(false);
  React.useEffect(() => {
    if (isPending || inboxViewTrackedRef.current) return;
    inboxViewTrackedRef.current = true;
    analytics.track(AnalyticsEvent.ViewSecretaryInbox, { new_request_count: tabCounts.new });
  }, [isPending, tabCounts.new]);

  // VIEW_APPOINTMENT_REQUEST — each time a different request's detail is shown: a click in a
  // list, the auto-selected first "Nouveau" request, or the next one after a status change.
  // A poll refresh of the same request, or a status change keeping it in the same tab, doesn't
  // re-fire. The ref also keeps StrictMode's double effect run from double-tracking.
  const lastViewedRequestKeyRef = React.useRef<string | undefined>(undefined);
  const trackRequestView = React.useEffectEvent(() => {
    if (viewedRequest) {
      analytics.track(
        AnalyticsEvent.ViewAppointmentRequest,
        getRequestTrackingProperties(viewedRequest)
      );
    }
  });
  React.useEffect(() => {
    if (viewedRequestKey === lastViewedRequestKeyRef.current) return;
    lastViewedRequestKeyRef.current = viewedRequestKey;
    if (viewedRequestKey) trackRequestView();
  }, [viewedRequestKey]);

  function handleTabClick(tab: InboxRequestStatus) {
    if (tab !== activeTab) {
      analytics.track(AnalyticsEvent.ViewInboxTab, {
        tab_name: toInboxTabName(tab),
        request_count: tabCounts[tab],
      });
    }
    setRawActiveTab(tab);
    setDetailId(undefined);
    void refetchTab(tab);
  }

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [toast]);

  /** Moves the request right away, then persists it; rolls the move back if the API fails. */
  function applyOverride(id: string, override: InboxRequestOverride) {
    setOverrides(current => ({ ...current, [id]: override }));
    updateStatus(
      { id, status: toApiStatus(override), status_reason: override.reason },
      {
        onError: () =>
          setOverrides(current => {
            const { [id]: _, ...rest } = current;
            return rest;
          }),
      }
    );
  }

  function getNextId(id: string) {
    const currentIndex = tabRequests.findIndex(request => request.id === id);
    const remaining = tabRequests.filter(request => request.id !== id);
    return (tabRequests[currentIndex + 1] ?? remaining[0])?.id;
  }

  function handleStatusChange(status: InboxRequestStatus) {
    if (!selectedRequest) return;
    const changedId = selectedRequest.id;
    const nextId = getNextId(changedId);
    applyOverride(changedId, {
      status,
      outcome: getStatusOutcome(status),
      processedAt: formatInboxTimestamp(),
    });
    setSelectedId(nextId);
    if (status === 'processed') {
      setToast({ label: 'Rendez-vous validé' });
    }
  }

  function handleProcessRequest(reason: InboxProcessReason) {
    if (!selectedRequest) return;
    const processedId = selectedRequest.id;
    const nextId = getNextId(processedId);
    applyOverride(processedId, {
      status: 'processed',
      outcome: 'treated',
      reason,
      processedAt: formatInboxTimestamp(),
    });
    setSelectedId(nextId);
    setToast({ label: 'Marquée comme traitée' });
  }

  function handleDetailStatusChange(status: InboxRequestStatus) {
    if (!detailRequest) return;
    const changedId = detailRequest.id;
    if (status !== activeTab) setDetailId(getNextId(changedId));
    applyOverride(changedId, {
      status,
      outcome: getStatusOutcome(status),
      processedAt: formatInboxTimestamp(),
    });
    if (status === 'processed') {
      setToast({ label: 'Rendez-vous validé' });
    }
  }

  function handleDetailProcess(reason: InboxProcessReason) {
    if (!detailRequest) return;
    const processedId = detailRequest.id;
    setDetailId(getNextId(processedId));
    applyOverride(processedId, {
      status: 'processed',
      outcome: 'treated',
      reason,
      processedAt: formatInboxTimestamp(),
    });
    setToast({ label: 'Marquée comme traitée' });
  }

  return (
    <div className="flex w-full flex-1 flex-col items-start">
      <div className="flex h-20 w-full items-center px-6">
        <p className="font-heading text-body-primary text-2xl font-medium tracking-[-0.24px]">
          Demandes de rendez-vous
        </p>
      </div>
      <div className="border-neutral-10 flex w-full flex-1 flex-col items-start overflow-hidden rounded-2xl border bg-white">
        <div className="border-neutral-10 flex w-full items-start gap-2 border-b px-3 py-4">
          <SegmentedButton>
            {visibleTabs.map(tab => (
              <SegmentedItem
                key={tab.value}
                label={tab.label}
                count={tab.value === 'new' && tabCounts.new > 0 ? tabCounts.new : undefined}
                active={activeTab === tab.value}
                onClick={() => handleTabClick(tab.value)}
              />
            ))}
          </SegmentedButton>
        </div>
        {isPending && tabRequests.length === 0 ? (
          <div className="flex w-full flex-1 items-center justify-center py-34">
            <Loader className="size-8" thickness={87} />
          </div>
        ) : tabRequests.length === 0 ? (
          <InboxEmpty label={emptyLabel} />
        ) : detailRequest ? (
          <div className="flex w-full flex-1 items-center overflow-hidden">
            <InboxDetailNav
              requests={tabRequests}
              selectedId={detailRequest.id}
              onSelect={setDetailId}
            />
            <InboxDetails
              request={detailRequest}
              onStatusChange={
                detailRequest.status === 'reminder' || isInboxRequestTreated(detailRequest)
                  ? handleDetailStatusChange
                  : undefined
              }
              onProcess={detailRequest.status === 'reminder' ? handleDetailProcess : undefined}
              onClose={() => setDetailId(undefined)}
            />
          </div>
        ) : activeTab === 'processed' ? (
          <InboxProcessedList requests={tabRequests} onSelect={setDetailId} />
        ) : activeTab === 'reminder' ? (
          <InboxReminderList requests={tabRequests} onSelect={setDetailId} />
        ) : (
          <div className="flex w-full flex-1 items-center overflow-hidden">
            <InboxList
              requests={tabRequests}
              selectedId={selectedRequest?.id}
              onSelect={setSelectedId}
              searchValue={search}
              onSearchChange={setSearch}
            />
            {selectedRequest && (
              <InboxDetails
                request={selectedRequest}
                onStatusChange={handleStatusChange}
                onProcess={handleProcessRequest}
              />
            )}
          </div>
        )}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <Toast
            label={toast.label}
            icon={<CheckCircleIcon className="text-heading-primary size-6" />}
            onClose={() => setToast(null)}
            className="w-93"
          />
        </div>
      )}
    </div>
  );
}
