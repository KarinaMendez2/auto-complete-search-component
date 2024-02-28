import React, { useState, useEffect } from 'react';

interface Suggestion {
  id: number;
  name: string;
}

const AutoComplete: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    document.title = "AutoComplete - Deel";

    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(inputValue);
  }, [fetchSuggestions, inputValue]);

  return (
    <div>
      <h2>Auto Complete Component Example</h2>
      <span className='input-title'>Search user names:</span><br></br>
      <input
        type="text"
        data-testid="searchInputID"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type to search..."
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul data-testid="resultsID">
          {suggestions.map((suggestion) => {
            const [before, match, after] = highlightMatch(
              suggestion.name,
              inputValue
            );
            return (
              <li key={suggestion.id}>
                {before}
                <span className='highlight-match'>{match}</span>
                {after}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
