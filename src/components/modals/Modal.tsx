import { DialogContentProps, DialogProps } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';

interface BasicModalProps extends DialogProps, DialogContentProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  disableClickOutside?: boolean;
  description?: string;
  overideFooter?: React.ReactNode | null;
}

const BasicModal: React.FC<BasicModalProps> = ({
  open,
  onClose,
  children,
  title,
  disableClickOutside = false,
  overideFooter,
  description,
  onSubmit
}) => {
  // const [open, setOpen] = useState(false)
  console.log(Boolean(overideFooter), '<< CHECK OVERRIDE');
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
        className="sm:max-w-[425px] md:min-w-[600px] lg:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="grid gap-3 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
        {overideFooter === null ? null : (
          <DialogFooter>
            {Boolean(overideFooter) ? (
              overideFooter
            ) : (
              <>
                <Button type="submit" variant={'outline'} onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSubmit}>Save changes</Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BasicModal;
