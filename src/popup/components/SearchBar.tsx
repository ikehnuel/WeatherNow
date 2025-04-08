import React, { useState } from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (query) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <form className="container" onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter location"
                className="input"
            />
            <button type="submit" className="button">Search</button>
        </form>
    );
};

export default SearchBar;