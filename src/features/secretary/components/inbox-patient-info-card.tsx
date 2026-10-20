import * as React from 'react';

import { Link } from '@/components/ui';
import { MISSING_VALUE } from '@/features/secretary/lib/map-consultation-request';
import type { InboxPatientInfoCardProps } from '@/features/secretary/types';
import { CalendarIcon, CopyIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/icons';

export function InboxPatientInfoCard({ info, onCopy }: InboxPatientInfoCardProps) {
  const [copied, setCopied] = React.useState(false);

  /** Copies every known field of the card, one per line — missing ones are skipped. */
  async function handleCopy(event: React.MouseEvent) {
    event.preventDefault();
    const text = [info.birthDate, info.phone, info.email, info.postalAddress]
      .filter(value => value && value !== MISSING_VALUE)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    onCopy?.();
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border-neutral-20 flex w-full flex-col items-center border-b pb-8">
      <div className="flex w-full items-center justify-center pb-4">
        <p className="text-body-primary flex-1 text-base font-medium">
          Informations de la patiente
        </p>
      </div>
      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex w-full items-center gap-2">
          <CalendarIcon size={24} color="formFieldIcon" />
          <p className="text-body-secondary text-sm">{info.birthDate}</p>
        </div>
        <div className="flex w-full items-center gap-2">
          <PhoneIcon size={24} color="formFieldIcon" />
          <p className="text-body-secondary flex-1 text-sm">{info.phone}</p>
        </div>
        <div className="flex w-full items-center gap-2">
          <MailIcon size={24} fillColor="formFieldIcon" />
          <p className="text-body-secondary text-sm">{info.email}</p>
        </div>
        <div className="flex w-full items-center gap-2">
          <MapPinIcon size={24} color="formFieldIcon" />
          <p className="text-body-secondary text-sm">{info.postalAddress}</p>
        </div>
      </div>
      <div className="flex w-full items-start gap-4 pt-6">
        <Link
          href="#"
          label={copied ? 'Copié' : 'Copier'}
          size="sm"
          icon={<CopyIcon className="size-3.5" />}
          iconPosition="left"
          onClick={handleCopy}
        />
      </div>
    </div>
  );
}
