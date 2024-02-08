import React, { useState, ChangeEvent } from 'react';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [text, setText] = useState('');


  const handleIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };




  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(text)
      setText('')
    }
  };

  const handleSubmit = () =>{
   // console.log('SUBMIT')
    onSearch(text)
    setText('')
  }



  return (
    <div className="rounded-full p-4 w-full max-w-full text-white flex justify-center space-x-2">
      <div className="flex-1 relative flex items-center">

        <input
          type="text"
          id="certID"
          placeholder={`search module...`}
          value={text}
          onChange={handleIDChange}
          onKeyDown={handleEnterPress}
          className="border-2 border-blue-400 focus:border-blue-600 text-base  md:text-lg rounded-full w-full text-black pl-3 py-2 pr-8 bg-white"
        />
        <div onClick={handleSubmit} className="absolute text-lg md:text-xl inset-y-0 right-0 flex items-center pr-2 pointer-events-auto text-gray-400">
          <RiSearchLine  />
        </div>
      </div>
    </div>
  );

};

export default SearchBar;