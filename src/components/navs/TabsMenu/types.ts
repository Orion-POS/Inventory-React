import React from "react";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ItemMenuProps {
  key: string | number;
  label: string;
  children: React.ReactNode;
  value: string;
}

export interface VerticalTabsMenuProps {
  items: ItemMenuProps[];
  activeIdx: number;
  handleOnChangeTabs: (event: React.SyntheticEvent<Element, Event>, value: any) => void;
}