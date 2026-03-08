import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) =>
    opt.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if all VISIBLE options are selected
  const isAllSelected = filteredOptions.length > 0 && 
    filteredOptions.every(opt => selectedOptions.includes(opt.value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    } else {
      setSearchQuery(""); // Reset search when closed
    }
  }, [isOpen]);

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Unselect only those that are currently visible
      const visibleValues = filteredOptions.map(opt => opt.value);
      updateSelection(selectedOptions.filter(val => !visibleValues.includes(val)));
    } else {
      // Select all visible + what was already selected
      const visibleValues = filteredOptions.map(opt => opt.value);
      const uniqueSelected = Array.from(new Set([...selectedOptions, ...visibleValues]));
      updateSelection(uniqueSelected);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else if (focusedIndex === -2) handleSelectAll(); // Select All
        else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : -2));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) setFocusedIndex((prev) => (prev > -2 ? prev - 1 : filteredOptions.length - 1));
        break;
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative w-full">
        <div
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          tabIndex={disabled ? -1 : 0}
          className={`flex min-h-[44px] w-full rounded-lg border border-gray-300 bg-white transition-all focus-within:border-blue-500 dark:border-gray-700 dark:bg-gray-900 ${
            disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "cursor-pointer"
          }`}
        >
          {/* WRAPPER TAGS: Dengan scrollbar internal */}
          <div className="flex flex-1 flex-wrap gap-1.5 p-2 max-h-32 overflow-y-auto custom-scrollbar">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((val) => {
                const text = options.find((opt) => opt.value === val)?.text || val;
                return (
                  <div
                    key={val}
                    className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-100 dark:border-blue-800"
                  >
                    <span>{text}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) updateSelection(selectedOptions.filter((v) => v !== val));
                      }}
                      className="hover:text-red-500 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 3L3 9M3 3l6 6" />
                      </svg>
                    </button>
                  </div>
                );
              })
            ) : (
              <span className="text-sm text-gray-400 px-1 py-1">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center pr-3">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 animate-in fade-in zoom-in duration-150">
            
            {/* SEARCH INPUT */}
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 p-2 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "Enter") {
                      // Prevent input behavior and let handleKeyDown handle navigation
                      if (filteredOptions.length > 0 || e.key === "ArrowDown") return;
                    }
                  }}
                />
              </div>
            </div>

            {/* OPSI: SELECT ALL */}
            {filteredOptions.length > 0 && (
              <div
                onClick={handleSelectAll}
                className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 ${
                  focusedIndex === -2 ? "bg-blue-50 dark:bg-gray-800" : ""
                }`}
              >
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {isAllSelected ? "Deselect All" : "Select All"}
                </span>
                <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  isAllSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                }`}>
                  {isAllSelected && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )}

            {/* OPSI: INDIVIDUAL LIST */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = selectedOptions.includes(option.value);
                const isFocused = index === focusedIndex;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isFocused ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    } ${isSelected ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    <span>{option.text}</span>
                    <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No data found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;