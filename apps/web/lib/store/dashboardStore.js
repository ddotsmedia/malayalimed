// dashboardStore.js — patient dashboard client state (Zustand).
'use client';
import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  dashboardData: null,
  fetchedAt: 0,
  setData: (dashboardData) => set({ dashboardData, fetchedAt: Date.now() }),
  isStale: (maxAgeMs = 300000) => Date.now() - (useDashboardStore.getState().fetchedAt || 0) > maxAgeMs,
}));
