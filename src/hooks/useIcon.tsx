import * as React from 'react';

import type { IconColorToken, IconProps } from '@/types';

const colorTokenToCssVar: Record<IconColorToken, string> = {
  headingPrimary: 'var(--color-heading-primary)',
  bodyPrimary: 'var(--color-body-primary)',
  neutral90: 'var(--color-neutral-90)',
  neutral05: 'var(--color-neutral-05)',
  neutralWhite: 'var(--color-neutral-white)',
  formFieldPlaceholder: 'var(--color-form-field-placeholder)',
  formFieldIcon: 'var(--color-form-field-icon)',
  formFieldText: 'var(--color-form-field-text)',
  formFieldTextDisabled: 'var(--color-form-field-text-disabled)',
  formFieldTextErrored: 'var(--color-form-field-text-errored)',
  buttonDisabledText: 'var(--color-button-disabled-text)',
  surfaceCream10: 'var(--color-surface-cream-10)',
  paginationActivated: 'var(--color-pagination-activated)',
  paginationEnabled: 'var(--color-pagination-enabled)',
  brandGoogle: 'var(--color-brand-google)',
  mainnavEnabled: 'var(--color-mainnav-enabled)',
  mainnavActivated: 'var(--color-mainnav-activated)',
};

function useIcon(props: IconProps) {
  const size = React.useMemo(() => {
    switch (props.size) {
      case 'tiny':
        return 19;
      case 'small':
        return 20;
      case 'medium':
        return 24;
      case 'large':
        return 29;
      case 'xLarge':
        return 35;
      case 'xxLarge':
        return 45;
      default:
        if (typeof props.size === 'number') {
          return props.size;
        } else {
          return 25;
        }
    }
  }, [props.size]);

  const color = React.useMemo(() => colorTokenToCssVar[props.color ?? 'neutral90'], [props.color]);

  const fillColor = React.useMemo(
    () => colorTokenToCssVar[props.fillColor ?? 'neutral90'],
    [props.fillColor]
  );

  const strokeWidth = React.useMemo(() => props.strokeWidth || 1, [props.strokeWidth]);

  return { size, color, strokeWidth, style: props.style, fillColor };
}

export default useIcon;
