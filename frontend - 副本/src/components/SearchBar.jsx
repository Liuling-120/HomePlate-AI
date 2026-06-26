import { useState } from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ value, onChange, placeholder = '搜索...' }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 py-3 pl-12 pr-10 bg-white rounded-card card-shadow focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
      />
      <Search 
        size={20} 
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
          isFocused ? 'text-primary' : 'text-gray-400'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;