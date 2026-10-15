import * as React from 'react';

interface VisualViewportInsets {
  /** px the visual viewport is scrolled down from the layout viewport's top (iOS pans it when focusing an input). */
  top: number;
  /** px of the layout viewport hidden below the visual viewport — i.e. the on-screen keyboard's height. */
  bottom: number;
}

const ZERO: VisualViewportInsets = { top: 0, bottom: 0 };

/**
 * Tracks how much of the layout viewport is covered by the mobile on-screen keyboard.
 * iOS Safari (and Android Chrome by default) don't shrink the layout viewport when the
 * keyboard opens, so `position: fixed; bottom: 0` elements end up partly behind it.
 * Use the returned insets to pin fixed UI to the *visible* area instead.
 */
function useVisualViewportInsets(enabled = true): VisualViewportInsets {
  const [insets, setInsets] = React.useState<VisualViewportInsets>(ZERO);

  React.useEffect(() => {
    const viewport = window.visualViewport;
    if (!enabled || !viewport) return;

    function update() {
      if (!viewport) return;
      const top = Math.max(0, Math.round(viewport.offsetTop));
      const bottom = Math.max(
        0,
        Math.round(window.innerHeight - viewport.height - viewport.offsetTop)
      );
      setInsets(prev => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
    }

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, [enabled]);

  return enabled ? insets : ZERO;
}

export default useVisualViewportInsets;
