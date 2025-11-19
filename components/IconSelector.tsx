import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { ICON_OPTIONS, getIcon } from './Icons';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedIcon = ICON_OPTIONS.find(i => i.value === value) || ICON_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredIcons = ICON_OPTIONS.filter(icon =>
    icon.label.toLowerCase().includes(search.toLowerCase()) ||
    icon.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/5 transition-colors justify-between"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0">
            {getIcon(value, "w-4 h-4")}
          </div>
          <span className="truncate">{selectedIcon.label}</span>
        </div>
        <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-gray-50 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black/10"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200">
            {filteredIcons.map((icon) => (
              <button
                key={icon.value}
                onClick={() => {
                  onChange(icon.value);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`
                  w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors
                  ${value === icon.value ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <div className={`p-1.5 rounded-md shrink-0 ${value === icon.value ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    <icon.component className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left truncate">{icon.label}</span>
              </button>
            ))}
            {filteredIcons.length === 0 && (
               <div className="p-4 text-center text-xs text-gray-400">No icons found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};