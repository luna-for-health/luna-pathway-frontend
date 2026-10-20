import * as React from 'react';

import { Badge, Button } from '@/components/ui';
import { InboxDetailField } from '@/features/secretary/components/inbox-detail-field';
import { InboxDocuments } from '@/features/secretary/components/inbox-documents';
import { InboxPatientInfoCard } from '@/features/secretary/components/inbox-patient-info-card';
import { InboxProcessRequestModal } from '@/features/secretary/components/inbox-process-request-modal';
import { InboxStatusIcon } from '@/features/secretary/components/inbox-status-icon';
import { InboxSymptoms } from '@/features/secretary/components/inbox-symptoms';
import { getRequestTrackingProperties } from '@/features/secretary/lib/analytics';
import {
  getInboxStatusIconClassName,
  getInboxStatusLabel,
} from '@/features/secretary/lib/inbox-status';
import {
  getInboxProcessReasonBadgeColor,
  getInboxProcessReasonBadgeLabel,
} from '@/features/secretary/lib/process-reasons';
import type { InboxProcessReason } from '@/features/secretary/lib/process-reasons';
import type { InboxDetailsProps, InboxDocument } from '@/features/secretary/types';
import { CalendarCheckIcon, ClockFastForwardIcon, CrossIcon, ProcessedIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';

export function InboxDetails({ request, onStatusChange, onProcess, onClose }: InboxDetailsProps) {
  const [processModalOpen, setProcessModalOpen] = React.useState(false);
  const hasActions = Boolean(onStatusChange || onProcess);
  const showStatus = request.status !== 'new';

  function handleCopyPatientInfo() {
    analytics.track(AnalyticsEvent.CopyPatientInformation, getRequestTrackingProperties(request));
  }

  function handleOpenDocument(document: InboxDocument) {
    analytics.track(AnalyticsEvent.OpenAppointmentRequestDocument, {
      ...getRequestTrackingProperties(request),
      document_type: document.name,
    });
  }

  function handleConfirmProcess(reason: InboxProcessReason) {
    setProcessModalOpen(false);
    onProcess?.(reason);
  }

  return (
    <div className="flex h-full flex-1 flex-col items-start overflow-y-auto">
      <div className="border-neutral-10 flex w-full flex-col items-start border-b p-8">
        <div className={cn('flex w-full flex-col gap-2', hasActions && 'pb-6')}>
          <div className="flex w-full items-start gap-2">
            <p className="font-heading text-body-primary min-w-0 flex-1 text-2xl font-medium tracking-[-0.24px]">
              {request.patientName}
            </p>
            {onClose && (
              <Button variant="neutral" size="icon-pill" aria-label="Fermer" onClick={onClose}>
                <CrossIcon className="size-5" />
              </Button>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <p className="text-body-tertiary text-sm">Demande reçue le {request.receivedAt}</p>
            {showStatus && (
              <div className="flex w-full items-center gap-1">
                <InboxStatusIcon
                  request={request}
                  className={cn('size-6 shrink-0', getInboxStatusIconClassName(request))}
                />
                <p className="text-body-tertiary min-w-0 flex-1 text-sm">
                  {getInboxStatusLabel(request)}
                </p>
                {request.processReason && (
                  <Badge
                    label={getInboxProcessReasonBadgeLabel(request.processReason)}
                    color={getInboxProcessReasonBadgeColor(request.processReason)}
                    size="md"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {hasActions && (
          <div className="flex w-full items-start gap-2">
            {onStatusChange && (
              <>
                <Button size="pill" onClick={() => onStatusChange('processed')}>
                  <CalendarCheckIcon className="size-6" />
                  RDV validé
                </Button>
                {request.status !== 'reminder' && (
                  <Button variant="outline" size="pill" onClick={() => onStatusChange('reminder')}>
                    <ClockFastForwardIcon className="size-6" />A rappeler
                  </Button>
                )}
              </>
            )}
            {onProcess && (
              <Button variant="outline" size="pill" onClick={() => setProcessModalOpen(true)}>
                <ProcessedIcon className="size-6" />
                Archiver
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-start p-8">
        <InboxPatientInfoCard info={request.patientInfo} onCopy={handleCopyPatientInfo} />
        <InboxDetailField label="Motif de consultation" value={request.consultationReason} />
        <InboxDetailField
          label="IRM ou échographie de moins de 12 mois"
          value={
            request.hasRecentImaging === undefined ? '—' : request.hasRecentImaging ? 'Oui' : 'Non'
          }
        />
        <InboxDetailField label="Histoire" value={request.story} />
        <InboxSymptoms symptoms={request.symptoms} />
        <InboxDocuments documents={request.documents} onOpen={handleOpenDocument} />
      </div>
      <InboxProcessRequestModal
        open={processModalOpen}
        onOpenChange={setProcessModalOpen}
        onConfirm={handleConfirmProcess}
      />
    </div>
  );
}
