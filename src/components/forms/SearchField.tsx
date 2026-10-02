import { Search } from '@carbon/icons-react';
import React from 'react';
import { InputText } from '.';

const InputWithIcon: React.FC<{ placeholder?: string }> = ({ placeholder = 'Search' }) => {
  return <InputText iconEnd={<Search />} placeholder={placeholder} />;
};

export default InputWithIcon;
