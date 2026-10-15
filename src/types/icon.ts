import type * as React from 'react';

export type IconSize = 'tiny' | 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge' | number;

export type IconColorToken =
  | 'headingPrimary'
  | 'bodyPrimary'
  | 'neutral90'
  | 'neutral05'
  | 'neutralWhite'
  | 'formFieldPlaceholder'
  | 'formFieldIcon'
  | 'formFieldText'
  | 'formFieldTextDisabled'
  | 'formFieldTextErrored'
  | 'buttonDisabledText'
  | 'surfaceCream10'
  | 'paginationActivated'
  | 'paginationEnabled'
  | 'brandGoogle'
  | 'mainnavEnabled'
  | 'mainnavActivated';

export interface IconProps {
  color?: IconColorToken | undefined;
  fillColor?: IconColorToken | undefined;
  size?: IconSize | undefined;
  strokeWidth?: number | undefined;
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
}
