"use client";

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia('(pointer: fine)');
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia('(pointer: fine)').matches;
}

function getServerSnapshot() {
  return false;
}

export function usePointerFine() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
