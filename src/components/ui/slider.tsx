import * as React from 'react';

import { Slider as RadixSlider } from 'radix-ui';

import { cn } from '@/lib/utils';

interface SliderProps {
  steps: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { className, steps, value, defaultValue, onValueChange, disabled, ...props },
  ref
) {
  const isControlled = value !== undefined;
  const [current, setCurrent] = React.useState(value ?? defaultValue ?? 0);

  React.useEffect(() => {
    if (isControlled) setCurrent(value as number);
  }, [isControlled, value]);

  function handleValueChange(next: number[]) {
    const nextValue = next[0] ?? 0;
    setCurrent(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <RadixSlider.Root
      ref={ref}
      className={cn('relative flex touch-none items-center gap-1 select-none', className)}
      min={0}
      max={steps - 1}
      step={1}
      value={[current]}
      onValueChange={handleValueChange}
      disabled={disabled}
      {...props}
    >
      <RadixSlider.Track className="relative flex items-center gap-1">
        {Array.from({ length: steps }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-2 rounded-full transition-all',
              index === current ? 'bg-pagination-activated w-10' : 'bg-pagination-enabled w-2'
            )}
          />
        ))}
      </RadixSlider.Track>
      <RadixSlider.Thumb className="sr-only" aria-label="Diapositive" />
    </RadixSlider.Root>
  );
});

export { Slider };
