'use client';

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
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
  name?: string;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const selectedIndex = value ? options.indexOf(value) : -1;
  const [highlightedIndex, setHighlightedIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );

  const modifierClass = id.replace(/-/g, '_');

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
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

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[highlightedIndex]?.focus();
    }
  }, [highlightedIndex, isOpen]);

  const selectedOption = value;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const openSelect = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setHighlightedIndex(index);
    setIsOpen(true);
  };

  const moveHighlight = (direction: 1 | -1) => {
    setHighlightedIndex(currentIndex => {
      const nextIndex = currentIndex + direction;
      return Math.min(Math.max(nextIndex, 0), options.length - 1);
    });
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        openSelect();
      } else {
        moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
      }
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setHighlightedIndex(event.key === 'Home' ? 0 : options.length - 1);
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(options[index]);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleOptionMouseDown = (event: ReactMouseEvent<HTMLLIElement>) => {
    event.preventDefault();
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
          ref={buttonRef}
          type="button"
          className={`${css.customSelectButton} ${css[`button_${modifierClass}`] || ''}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-labelledby={`${id}-label`}
          onClick={() => setIsOpen(prev => !prev)}
          onKeyDown={handleButtonKeyDown}
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
            className={`${css.customSelectListWrapper} ${css[`list_${modifierClass}`] || ''}`}
          >
            <ul
              id={`${id}-listbox`}
              className={`${css.customSelectList}`}
              role="listbox"
              aria-labelledby={`${id}-label`}
            >
              {options.map((opt, index) => (
                <li
                  key={opt}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={opt === value}
                  tabIndex={index === highlightedIndex ? 0 : -1}
                  ref={element => {
                    optionRefs.current[index] = element;
                  }}
                  className={`${css.customSelectOption} ${opt === value ? css.selected : ''}`}
                  onKeyDown={event => handleOptionKeyDown(event, index)}
                  onMouseDown={handleOptionMouseDown}
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
