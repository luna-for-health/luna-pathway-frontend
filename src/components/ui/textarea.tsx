import * as React from 'react';

import { cn } from '@/lib/utils';
import type { TextareaProps } from '@/types';

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, children, error = false, id, rows = 1, value, ...props },
  forwardedRef
) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const hasError = Boolean(error);
  const innerRef = React.useRef<HTMLTextAreaElement>(null);

  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  /**
   * Grows the field to fit its content. `scrollHeight` ignores the placeholder, so while the
   * field is empty it's measured with the placeholder as a temporary value — otherwise a long
   * placeholder gets clipped to a single line.
   */
  const resize = React.useCallback(() => {
    const node = innerRef.current;
    if (!node) return;
    node.style.height = 'auto';
    if (node.value === '' && node.placeholder) {
      node.value = node.placeholder;
      node.style.height = `${node.scrollHeight}px`;
      node.value = '';
    } else {
      node.style.height = `${node.scrollHeight}px`;
    }
  }, []);

  React.useLayoutEffect(() => {
    resize();
  }, [resize, value, props.placeholder]);

  // Wrapping (and so the height) changes with the field's width.
  React.useEffect(() => {
    const node = innerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    let lastWidth = node.clientWidth;
    const observer = new ResizeObserver(() => {
      if (node.clientWidth === lastWidth) return;
      lastWidth = node.clientWidth;
      resize();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [resize]);

  return (
    <div
      className={cn(
        'flex min-h-18 w-full flex-col items-start overflow-hidden rounded-lg transition-colors',
        hasError
          ? 'bg-form-field-background-errored border-form-field-border-errored border has-[textarea:focus]:border-2 has-[textarea:focus]:shadow-[0_0_0_2px_var(--color-form-field-shadow-errored)]'
          : 'bg-form-field-background border-form-field-border hover:border-form-field-border-hovered has-[textarea:focus]:border-form-field-border-hovered border has-[textarea:focus]:border-2 has-[textarea:focus]:shadow-[0_0_0_2px_var(--color-form-field-border-focused)]',
        'has-[textarea:disabled]:border-form-field-border-disabled has-[textarea:disabled]:bg-form-field-background-disabled',
        className
      )}
    >
      <div className="flex w-full items-start px-6 py-4">
        <textarea
          ref={setRefs}
          id={textareaId}
          rows={rows}
          value={value}
          onInput={resize}
          aria-invalid={hasError || undefined}
          className="text-form-field-text placeholder:text-form-field-placeholder disabled:text-form-field-text-disabled w-full resize-none overflow-hidden bg-transparent text-sm leading-5 outline-none disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      {children}
    </div>
  );
});

export { Textarea };
