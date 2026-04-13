"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useState, useEffect } from "react";

interface NoteSearchProps {
  /** Callback when search value changes (debounced) */
  onSearch: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Current search value (for controlled usage) */
  value?: string;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
}

/**
 * Search input component with debounce functionality
 * Used for searching notes by title and content
 */
export function NoteSearch({
  onSearch,
  placeholder = "Search notes...",
  value: externalValue,
  debounceDelay = 300,
}: NoteSearchProps) {
  const [internalValue, setInternalValue] = useState(externalValue || "");
  const debouncedValue = useDebounce(internalValue, debounceDelay);

  // Use external value if provided (controlled), otherwise use internal state
  const currentValue = externalValue !== undefined ? externalValue : internalValue;

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (externalValue === undefined) {
        setInternalValue(newValue);
      }
    },
    [externalValue]
  );

  const handleClear = useCallback(() => {
    if (externalValue === undefined) {
      setInternalValue("");
    }
    onSearch("");
  }, [externalValue, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        className="pl-10 pr-10"
        aria-label="Search notes"
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
