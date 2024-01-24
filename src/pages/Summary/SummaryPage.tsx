import { Add } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { Button } from '@mui/material';
import { VerticalTabsMenu } from '../../components/navs/TabsMenu';

const SummaryPage = () => {
  return (
    <div>
      <Button className="bg-brand-500 capitalize text-white" startIcon={<Add />}>
        Add new stock
      </Button>
    </div>
  );
};

export default SummaryPage;
