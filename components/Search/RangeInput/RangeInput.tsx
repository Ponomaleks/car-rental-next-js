import clsx from 'clsx';
import css from './RangeInput.module.css';

import type { Dispatch, SetStateAction } from 'react';

interface MileageRangeState {
  minMileage?: string;
  maxMileage?: string;
}

interface RangeInputProps<State extends MileageRangeState> {
  state: State;
  setStateFunc: Dispatch<SetStateAction<State>>;
}

export default function RangeInput<State extends MileageRangeState>({
  state,
  setStateFunc,
}: RangeInputProps<State>) {
  return (
    <fieldset className={css.mileageFieldset}>
      <legend className={css.mileageLegend}>Car mileage / km</legend>
      <div className={css.rangeInputsContainer}>
        <label htmlFor="minMileage" className="visually-hidden">
          From
        </label>
        <input
          id="minMileage"
          name="minMileage"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={state.minMileage ?? ''}
          onChange={event =>
            setStateFunc(prev => ({
              ...prev,
              minMileage: event.target.value || undefined,
            }))
          }
          className={clsx(css.input, css.leftInput)}
          placeholder="From"
        />
        <label htmlFor="maxMileage" className="visually-hidden">
          To
        </label>
        <input
          id="maxMileage"
          name="maxMileage"
          type="number"
          min="0"
          step="1"
          value={state.maxMileage ?? ''}
          onChange={event =>
            setStateFunc(prev => ({
              ...prev,
              maxMileage: event.target.value || undefined,
            }))
          }
          className={clsx(css.input, css.rightInput)}
          placeholder="To"
        />
      </div>
    </fieldset>
  );
}
