'use client';

import { CarFetchParams, CarFilters } from '@/lib/api';
import css from './Search.module.css';
import Select from './Select/Select';
import RangeInput from './RangeInput/RangeInput';
import clsx from 'clsx';

interface SearchProps {
  draftFilters: CarFetchParams;
  setDraftFilters: React.Dispatch<React.SetStateAction<CarFetchParams>>;
  filters?: CarFilters;
  priceOptions?: string[];
  formAction: (formData: FormData) => void;
  clearFilters: () => void;
}

export default function Search({
  filters,
  priceOptions,
  draftFilters,
  setDraftFilters,
  formAction,
  clearFilters,
}: SearchProps) {
  return (
    <form
      aria-label="Search cars"
      onSubmit={event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formAction(formData);
      }}
      className={css.searchForm}
    >
      <Select
        id="brand-select"
        name="brand"
        label="Car brand"
        placeholder="Choose a brand"
        value={draftFilters.brand ?? ''}
        options={filters?.brands ?? []}
        onChange={val =>
          setDraftFilters(prev => ({
            ...prev,
            brand: val || undefined,
          }))
        }
      />

      <Select
        id="price-select"
        name="price"
        label="Price/ 1 hour"
        placeholder="Choose a price"
        value={draftFilters.price ?? ''}
        options={priceOptions ?? []}
        formatSelectedValue={selectedLabel => `To $${selectedLabel}`}
        onChange={val =>
          setDraftFilters(prev => ({
            ...prev,
            price: val || undefined,
          }))
        }
      />

      <RangeInput state={draftFilters} setStateFunc={setDraftFilters} />

      <div className={css.actionsContainer}>
        <button
          type="submit"
          className={clsx(css.searchButton, `button button_primary`)}
        >
          Search
        </button>
        <button type="button" className={css.clear} onClick={clearFilters}>
          Clear filters
        </button>
      </div>
    </form>
  );
}
