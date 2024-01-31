import { Search } from '@carbon/icons-react';
import React from 'react';
import { InputText } from '.';

const InputWithIcon: React.FC = ({ placeholder }) => {
  return <InputText iconEnd={<Search />} placeholder="Search" />;
};

export default InputWithIcon;
