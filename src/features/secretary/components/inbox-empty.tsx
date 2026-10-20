/**
 * Figma node 7497:3779 ("inbox / inbox 0", Luna-App file) — shown inside the
 * main card, under the tabs, when the active tab has no request to display.
 */
interface InboxEmptyProps {
  label: string;
}

export function InboxEmpty({ label }: InboxEmptyProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 py-34">
      <span aria-hidden="true" className="text-[40px] leading-normal">
        💜
      </span>
      <p className="text-body-primary text-base whitespace-nowrap">{label}</p>
    </div>
  );
}
