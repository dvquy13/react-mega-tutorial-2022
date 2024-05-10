import { createContext, useContext, useState, useCallback } from 'react';

export const FlashContext = createContext();
let flashTimer;

export default function FlashProvider({ children }) {
  const [flashMessage, setFlashMessage] = useState({});
  const [visible, setVisible] = useState(false);

  const hideFlash = useCallback(() => {
    setVisible(false);
  }, []);

  const flash = useCallback((message, type, duration = 10) => {
    // Check if there is an active flash timer
    if (flashTimer) {
      // Cancel the timer if there is one
      clearTimeout(flashTimer);
    }
    // The timer is no longer valid
    flashTimer = undefined;

    // The function is about to display a new flash message so we clear the timer
    if (flashTimer) {
      clearTimeout(flashTimer);
      flashTimer = undefined;
    }
    setFlashMessage({message, type});
    setVisible(true);
    if (duration) {
      // The duration argument defaults to 10 seconds, and the caller can pass 0 to skip
      // the timer creation and display an alert that remains visible until the user closes it manually.
      flashTimer = setTimeout(hideFlash, duration * 1000);
    }
  }, [hideFlash]);

  return (
    <FlashContext.Provider value={{flash, hideFlash, flashMessage, visible}}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  return useContext(FlashContext).flash;
}