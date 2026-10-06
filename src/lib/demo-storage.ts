import { useSyncExternalStore } from 'react';
import { DemoBooking } from '@/types/booking';
import { initialDemoBookings } from '@/data/bookings';

const FAVORITES_STORAGE_KEY = 'skillconnect_favorites';
const BOOKINGS_STORAGE_KEY = 'skillconnect_demo_bookings';

const defaultFavorites = ['pro-marcus-vance', 'pro-elena-rodriguez'];

function notifyStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('skillconnect-storage-change'));
  }
}

function subscribeStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('skillconnect-storage-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('skillconnect-storage-change', callback);
    window.removeEventListener('storage', callback);
  };
}

export function getSavedFavorites(): string[] {
  if (typeof window === 'undefined') return defaultFavorites;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultFavorites;
  } catch {
    return defaultFavorites;
  }
}

export function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

export function getDemoBookings(): DemoBooking[] {
  if (typeof window === 'undefined') return initialDemoBookings;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(initialDemoBookings));
      return initialDemoBookings;
    }
    return JSON.parse(raw);
  } catch {
    return initialDemoBookings;
  }
}

export function addDemoBooking(booking: DemoBooking): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = [booking, ...current];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage booking save failed:', err);
  }
}

export function updateDemoBookingStatus(bookingId: string, status: DemoBooking['status']): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDemoBookings();
    const updated = current.map((b) => (b.id === bookingId ? { ...b, status } : b));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyStorageChange();
  } catch (err) {
    console.warn('LocalStorage update failed:', err);
  }
}

// React 19 Idiomatic Sync Hooks
export function useFavorites(): string[] {
  return useSyncExternalStore(
    subscribeStorage,
    getSavedFavorites,
    () => defaultFavorites
  );
}

export function useBookings(): DemoBooking[] {
  return useSyncExternalStore(
    subscribeStorage,
    getDemoBookings,
    () => initialDemoBookings
  );
}
