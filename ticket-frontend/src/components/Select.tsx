import React from 'react';
import {SelectProps} from '../interfaces/components'

const Select: React.FC<SelectProps> = ({ options, selectedValue, onChange }) => {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-200 
      focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;