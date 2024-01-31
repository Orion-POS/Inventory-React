import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';

interface BasicModalProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
  disableClickOutside?: boolean;
  overideFooter?: React.ReactNode;
}

const BasicModal: React.FC<BasicModalProps> = ({
  open,
  onClose,
  children,
  title,
  disableClickOutside = false,
  overideFooter
}) => {
  // const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent
        onCloseAutoFocus={() => {}}
        onPointerDownOutside={e => {
          if (disableClickOutside) {
            e.preventDefault();
          }
        }}
        className="sm:max-w-[425px] md:min-w-[600px] lg:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">{children}</div>
        <DialogFooter>
          {Boolean(overideFooter) ? (
            overideFooter
          ) : (
            <>
              <Button type="submit" variant={'outline'} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BasicModal;
