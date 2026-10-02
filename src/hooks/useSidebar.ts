import { useCallback, useState } from 'react';

const STORAGE_KEY = 'orion.sidebar.collapsed';

const readStored = (): boolean | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === null ? null : value === '1';
  } catch {
    return null;
  }
};

/**
 * Whether the desktop sidebar is collapsed to an icon rail. The choice is remembered; without
 * one, tablets start collapsed and larger screens start expanded.
 */
const useSidebar = () => {
  const [collapsed, setCollapsedState] = useState<boolean>(
    () => readStored() ?? !window.matchMedia('(min-width: 1024px)').matches
  );

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this visit only.
    }
  }, []);

  return { collapsed, setCollapsed };
};

export default useSidebar;
