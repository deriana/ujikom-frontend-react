import { useState } from "react";

export function useShowModal<T = string>() {
  const [showId, setShowId] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = (id: T) => {
    setShowId(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setShowId(null);
  };

  return { showId, isOpen, open, close };
}
