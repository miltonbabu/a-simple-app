"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Tag } from "@prisma/client";
import { TagBadge } from "./tag-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  /** Available tags for autocomplete suggestions */
  availableTags?: Tag[];
  /** Currently selected tags */
  selectedTags: Tag[];
  /** Callback when tags change */
  onTagsChange: (tags: Tag[]) => void;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Tag input component with autocomplete functionality
 * Allows adding existing tags or creating new ones dynamically
 */
export function TagInput({
  availableTags = [],
  selectedTags,
  onTagsChange,
  placeholder = "Add a tag...",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter available tags based on input (excluding already selected)
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.some((st) => st.id === tag.id)
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, availableTags, selectedTags]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Add a tag to the selection */
  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  /** Remove a tag from the selection */
  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  /** Handle keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      // Check if exact match exists in available tags
      const exactMatch = availableTags.find(
        (t) => t.name.toLowerCase() === inputValue.trim().toLowerCase()
      );

      if (exactMatch) {
        addTag(exactMatch);
      } else if (inputValue.trim()) {
        // Create new tag (will be handled by parent/API)
        const newTag: Tag = {
          id: `new-${Date.now()}`,
          name: inputValue.trim(),
          color: "#8B5CF6",
          createdAt: new Date(),
        };
        onTagsChange([...selectedTags, newTag]);
        setInputValue("");
      }
    }

    if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {/* Selected Tags */}
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            size="sm"
            onRemove={() => removeTag(tag.id)}
          />
        ))}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm py-1 px-1 bg-transparent"
          aria-label="Add tags"
        />

        {/* Clear All Button (if tags exist) */}
        {selectedTags.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onTagsChange([])}
            aria-label="Clear all tags"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-md shadow-lg max-h-[200px] overflow-auto">
          {filteredSuggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 transition-colors"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </button>
          ))}
          
          {/* Create New Option */}
          {inputValue.trim() &&
            !availableTags.some(
              (t) => t.name.toLowerCase() === inputValue.trim().toLowerCase()
            ) && (
              <button
                type="button"
                onClick={() => {
                  const newTag: Tag = {
                    id: `new-${Date.now()}`,
                    name: inputValue.trim(),
                    color: "#8B5CF6",
                    createdAt: new Date(),
                  };
                  onTagsChange([...selectedTags, newTag]);
                  setInputValue("");
                  setShowSuggestions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 text-primary font-medium border-t"
              >
                <Plus className="h-3 w-3" />
                Create &quot;{inputValue.trim()}&quot;
              </button>
            )}
        </div>
      )}
    </div>
  );
}
