'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import css from './Select.module.css';

interface SelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  formatSelectedValue?: (selectedLabel: string) => string;
  name?: string; // Optional name prop for the hidden input
}

export default function Select({
  id,
  label,
  placeholder,
  value,
  options,
  onChange,
  formatSelectedValue,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const modifierClass = id.replace(/-/g, '_');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement | HTMLUListElement>,
  ) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectedOption = value;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const displayButtonText = selectedOption
    ? formatSelectedValue
      ? formatSelectedValue(selectedOption)
      : selectedOption
    : placeholder;

  return (
    <div className={css.filterGroup} ref={selectRef}>
      <label id={`${id}-label`} className={css.filterLabel} htmlFor={id}>
        {label}
      </label>

      <div className={css.customSelectWrapper}>
        <button
          id={id}
          type="button"
          className={`${css.customSelectButton} ${css[`button_${modifierClass}`] || ''}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-labelledby={`${id}-label ${id}`}
          onClick={() => setIsOpen(prev => !prev)}
          onKeyDown={handleKeyDown}
        >
          <span
            className={!selectedOption ? css.placeholder : css.selectedValue}
          >
            {displayButtonText}
          </span>

          {isOpen ? (
            <FiChevronUp aria-hidden="true" />
          ) : (
            <FiChevronDown aria-hidden="true" />
          )}
        </button>

        {isOpen && (
          <div
            id={`${id}-listbox`}
            className={`${css.customSelectListWrapper} ${css[`list_${modifierClass}`] || ''}`}
            role="listbox"
            aria-labelledby={`${id}-label`}
          >
            <ul
              className={`${css.customSelectList}`}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
            >
              <option value="" hidden>
                {placeholder}
              </option>
              {options.map(opt => (
                <li
                  key={opt}
                  role="option"
                  aria-selected={opt === value}
                  className={`${css.customSelectOption} ${opt === value ? css.selected : ''}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <input type="hidden" name={name} value={selectedOption ?? ''} />
    </div>
  );
}
