import { VerticalTabsMenu } from "../../components/navs/TabsMenu"
import ItemCategory from "./ItemCategory"

const SetupPage = () => {

  const MENU_ITEMS = [
    {
      key: 0,
      label: 'Item Category',
      children:  <ItemCategory />
    },
    {
      key: 1,
      label: 'UoM Category',
      children:  (
        <div>
          UoM Category
        </div>
      )
    },
    {
      key: 2,
      label: 'Item Libraries',
      children:  (
        <div>
          Item Libraries
        </div>
      )
    },
    {
      key: 3,
      label: 'Transaction Type',
      children:  (
        <div>
          Transaction Type
        </div>
      )
    }
  ]
  
  return (
    <div className=" h-full">
      
      <VerticalTabsMenu items={MENU_ITEMS} />
    </div>
  )
}

export default SetupPage