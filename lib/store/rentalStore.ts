import { RentalFormData } from '@/types/car';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type RentalFormState = Partial<RentalFormData>;

interface RentalFormStore {
  draft: RentalFormState;
  setDraft: (newState: RentalFormState) => void;
  clearDraft: () => void;
}

const initialDraft: RentalFormState = {
  name: '',
  email: '',
  comment: '',
};

export const useRentalFormStore = create<RentalFormStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (newState: RentalFormState) =>
        set((state) => ({ draft: { ...state.draft, ...newState } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'rental-form-storage',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);