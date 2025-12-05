'use client';

import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'male', label: 'male' },
  { value: 'female', label: 'female' },
  { value: 'other', label: 'other' },
];

const CustomSelect = ({ label = 'Label', placeholder = '', className = '' }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className={`${className}`}>
      <label className='text-tertiary-100 text-14 text-normal block mb-2 capitalize'>{label}</label>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        className='profile-select'
        classNamePrefix='profile-select-inner'
        defaultMenuIsOpen={false}
        placeholder={placeholder}
      />
    </div>
  );
}

export default CustomSelect;