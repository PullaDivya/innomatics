import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch JSON data from the public folder
                const response = await fetch('/countries.json');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const suggestions = countries.filter(country =>
                country.country.toLowerCase().includes(value.toLowerCase()) ||
                country.capital.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(suggestions);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.country);
        setFilteredSuggestions([]);
        setSelectedCountry(suggestion); // Set the entire country object
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search for country or capital..."
                value={searchTerm}
                onChange={handleChange}
            />
            {filteredSuggestions.length > 0 && (
                <ul className="suggestions-list">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.country} ({suggestion.capital})
                        </li>
                    ))}
                </ul>
            )}
            {selectedCountry && (
                <div className="country-details">
                    <h2>{selectedCountry.country}</h2>
                    <p><strong>Capital:</strong> {selectedCountry.capital}</p>
                    <p><strong>Population:</strong> {selectedCountry.population.toLocaleString()}</p>
                    <p><strong>Official Language(s):</strong> {Array.isArray(selectedCountry.official_language) ? selectedCountry.official_language.join(', ') : selectedCountry.official_language}</p>
                    <p><strong>Currency:</strong> {selectedCountry.currency}</p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
