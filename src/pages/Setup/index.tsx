import RouteTabs, { type RouteTab } from '@/components/navs/RouteTabs';
import { Outlet } from 'react-router-dom';

const TABS: RouteTab[] = [
  { label: 'Item Category', to: 'item-category' },
  { label: 'UoM Category', to: 'uom-category' },
  { label: 'Item Libraries', to: 'item-libraries' },
  { label: 'Transaction Type', to: 'transaction-type' }
];

const SetupPage = () => (
  <div className="flex h-full min-h-0 flex-col">
    <RouteTabs tabs={TABS} label="Setup sections" />
    <div className="min-h-0 flex-1 overflow-auto pt-5">
      <Outlet />
    </div>
  </div>
);

export default SetupPage;
