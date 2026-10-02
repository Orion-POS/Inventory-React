import {
  Boxes,
  LayoutDashboard,
  ReceiptText,
  SlidersHorizontal,
  Truck,
  Warehouse
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLeaf {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  /** A link item. Items with `children` are groups and have no link of their own. */
  to?: string;
  children?: NavLeaf[];
}

export interface NavSection {
  /** Heading shown above the section; omitted for the first, self-explanatory one. */
  label?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ label: 'Summary', icon: LayoutDashboard, to: '/summary' }]
  },
  {
    label: 'Inventory',
    items: [
      {
        label: 'Stock Management',
        icon: Boxes,
        children: [
          { label: 'Used Stock', to: '/stock-management/used-stock' },
          { label: 'Adjustment', to: '/stock-management/adjustment' },
          { label: 'Stock Opname', to: '/stock-management/stock-opname' },
          { label: 'Wasted Stock', to: '/stock-management/wasted-stock' }
        ]
      },
      { label: 'Transaction', icon: ReceiptText, to: '/transaction' },
      { label: 'Suppliers', icon: Truck, to: '/suppliers' },
      { label: 'Assets', icon: Warehouse, to: '/assets' }
    ]
  },
  {
    label: 'Configuration',
    items: [{ label: 'Setup', icon: SlidersHorizontal, to: '/setup' }]
  }
];
