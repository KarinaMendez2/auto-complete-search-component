import React, { useState, useEffect } from 'react';

interface Suggestion {
  id: number;
  name: string;
}

const AutoComplete: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const autocompleteRef = React.useRef<HTMLDivElement | null>(null);


  const fetchSuggestions = React.useCallback(async (input: string) => {
    setIsLoading(true);

    try {
      // This is a free api for demostration purposes that already allows filtering like 'name_like'
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?name_like=${input}`);
      const data: Suggestion[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // This function takes the suggestion name and the input value, and returns an array with three parts:
  // the part before the match, the match, and the part after the match.
  const highlightMatch = (suggestion: string, inputValue: string) => {
    const matchStart = suggestion.toLowerCase().indexOf(inputValue.toLowerCase());
    const matchEnd = matchStart + inputValue.length;
    return [
      suggestion.substring(0, matchStart),
      suggestion.substring(matchStart, matchEnd),
      suggestion.substring(matchEnd),
    ];
  };

  useEffect(() => {
    document.title = "AutoComplete";

    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(inputValue);

    const handleClickOutside = (event: { target: any; }) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchSuggestions, inputValue]);

  // Example function to handle input change and debounce logic
  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
    setIsDropdownVisible(true);
    // Implement debounce logic here
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setIsDropdownVisible(false); // Close the dropdown when a suggestion is selected
  };

  return (
    <div ref={autocompleteRef}>
      <h2>Auto Complete Component Example</h2>
      <span className='input-title'>Search user names:</span><br></br>
      <div className='autocomplete-container'>
        <input
          className="input-field"
          type="text"
          data-testid="searchInputID"
          value={inputValue}
          onChange={handleChange}
          placeholder="Type to search..."
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : isDropdownVisible && suggestions.length > 0 && (
          <ul data-testid="resultsID" className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => {
              const [before, match, after] = highlightMatch(
                suggestion.name,
                inputValue
              );
              return (
                <li key={index} className='suggestion-item' onClick={() => handleSelectSuggestion(suggestion.name)}>
                  {before}
                  <span className='highlight-match'>{match}</span>
                  {after}
                </li>
              );
            })}
          </ul>
        )}
        {inputValue && !isLoading && !suggestions.length && <div className="error-message">No results</div>}
      </div>
    </div>
  );
};

export default AutoComplete;
