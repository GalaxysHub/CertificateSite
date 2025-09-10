'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onReview: () => void;
  onFlag: () => void;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
  enabled: boolean;
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onSubmit,
  onReview,
  onFlag,
  canNavigateNext,
  canNavigatePrevious,
  enabled = true
}: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Ignore if user is typing in an input or textarea
    const activeElement = document.activeElement;
    if (
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.getAttribute('contenteditable') === 'true'
    ) {
      return;
    }

    // Handle keyboard shortcuts
    switch (event.key) {
      case 'ArrowRight':
      case 'n':
      case 'N':
        if (canNavigateNext && (event.key === 'ArrowRight' || !event.shiftKey)) {
          event.preventDefault();
          onNext();
        }
        break;
        
      case 'ArrowLeft':
      case 'p':
      case 'P':
        if (canNavigatePrevious && (event.key === 'ArrowLeft' || !event.shiftKey)) {
          event.preventDefault();
          onPrevious();
        }
        break;
        
      case 'f':
      case 'F':
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
          event.preventDefault();
          onFlag();
        }
        break;
        
      case 'r':
      case 'R':
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
          event.preventDefault();
          onReview();
        }
        break;
        
      case 'Enter':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onSubmit();
        }
        break;
        
      case 'Escape':
        // Could be used to close modals or exit full screen
        break;
    }
  }, [
    enabled,
    onNext,
    onPrevious,
    onSubmit,
    onReview,
    onFlag,
    canNavigateNext,
    canNavigatePrevious
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return keyboard shortcuts help
  return {
    shortcuts: [
      { key: '→ / N', description: 'Next question', enabled: canNavigateNext },
      { key: '← / P', description: 'Previous question', enabled: canNavigatePrevious },
      { key: 'F', description: 'Flag/unflag question', enabled: true },
      { key: 'R', description: 'Review mode', enabled: true },
      { key: 'Ctrl + Enter', description: 'Submit test', enabled: true }
    ].filter(shortcut => shortcut.enabled)
  };
}