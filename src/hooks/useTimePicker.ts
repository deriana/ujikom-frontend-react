import { useState, useEffect, useCallback } from "react";

type Listener = (id: string | null) => void;
const listeners = new Set<Listener>();
let activeId: string | null = null;

export function setActivePicker(id: string | null) {
  activeId = id;
  listeners.forEach((l) => l(id));
}

export function useTimePickerManager(id: string) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handler: Listener = (currentId) => {
      setIsActive(currentId === id);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [id]);

  const open = useCallback(() => setActivePicker(id), [id]);
  const close = useCallback(() => setActivePicker(null), []);

  return { isOpen: isActive, open, close };
}