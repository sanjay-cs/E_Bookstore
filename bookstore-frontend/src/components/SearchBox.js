import React from 'react';

function SearchBox({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Search books..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      className="book-search-input"
    />
  );
}
export default SearchBox;
