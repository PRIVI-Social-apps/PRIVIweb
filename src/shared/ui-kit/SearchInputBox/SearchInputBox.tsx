import React from 'react';
import './SearchInputBox.css';

export const SearchInputBox = ({ keyword, setKeyword, placeholder = "" }) => {
    return (
        <div className="search-inputbox">
            <input className="input" value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder={placeholder} />
            <img src={require('assets/icons/search.png')} className="icon" />
        </div>
    );
}