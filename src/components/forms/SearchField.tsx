import { Search } from '@carbon/icons-react';
import React from 'react';
import { InputText } from '.';

const SearchField: React.FC = () => {
  return <InputText iconEnd={<Search />} placeholder="Search" />;
};

export default SearchField;
