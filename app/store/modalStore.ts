/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface ModalState {
  modalType: string | null;
  modalProps: Record<string, any>;
  openModal: (type: string, props?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  modalProps: {},
  openModal: (type, props = {}) => set({ modalType: type, modalProps: props }),
  closeModal: () => set({ modalType: null, modalProps: {} }),
}));
