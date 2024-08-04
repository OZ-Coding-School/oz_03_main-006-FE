import React, { useEffect } from 'react';

export const useCloseAlert = (
  ref: React.MutableRefObject<HTMLElement | null>,
  handler: () => void
) => {
  useEffect(() => {
    const mouseListener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    const keyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
      return;
    };

    document.addEventListener('mousedown', mouseListener);
    document.addEventListener('keydown', keyListener);

    return () => {
      document.removeEventListener('mousedown', mouseListener);
      document.removeEventListener('keydown', keyListener);
    };
  }, [ref, handler]);
};
