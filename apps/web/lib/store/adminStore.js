// adminStore.js — global admin UI state (Zustand). Persists lightweight prefs.
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(persist((set) => ({
  // current admin (hydrated from /api/admin/auth/me)
  adminUser: null,
  setUser: (adminUser) => set({ adminUser }),

  // modal registry: { addDoctor:false, editHospital:false, viewReview:false, ... }
  modals: {},
  modalData: null,
  openModal: (name, data = null) => set((s) => ({ modals: { ...s.modals, [name]: true }, modalData: data })),
  closeModal: (name) => set((s) => ({ modals: { ...s.modals, [name]: false }, modalData: null })),

  // per-page filters and pagination
  filters: {},
  setFilters: (page, patch) => set((s) => ({ filters: { ...s.filters, [page]: { ...(s.filters[page] || {}), ...patch } } })),
  pagination: {},
  setPagination: (page, patch) => set((s) => ({ pagination: { ...s.pagination, [page]: { ...(s.pagination[page] || { page: 1, limit: 25 }), ...patch } } })),

  // cached dashboard KPIs (optional convenience mirror of TanStack cache)
  dashboardData: null,
  setDashboardData: (dashboardData) => set({ dashboardData }),
}), {
  name: 'mm-admin-ui',
  partialize: (s) => ({ filters: s.filters, pagination: s.pagination }), // only persist prefs
}));
