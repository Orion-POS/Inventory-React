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
import { css } from '@emotion/react';

interface BasicModalProps extends DialogProps, DialogContentProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  subtitle?: string;
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
  subtitle,
  disableClickOutside = false,
  overideFooter = null,
  description,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onCloseAutoFocus={() => {}}
        onPointerDownOutside={e => {
          if (disableClickOutside) {
            e.preventDefault();
          }
        }}
        className="sm:max-w-[425px] md:min-w-[600px] lg:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-1">
              {title}
              <span
                className="flex p-1 items-center gap-2.5"
                css={css`
                  color: var(--Grey-Darker, #acacac);
                `}>
                {subtitle}
              </span>
            </div>
          </DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="grid gap-3 px-1 max-h-[70vh] overflow-y-auto">{children}</div>
        {overideFooter === null ? null : (
          <DialogFooter>
            {Boolean(overideFooter) ? (
              overideFooter
            ) : (
              <>
                <Button type="submit" variant={'outline'} onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSubmit}>Save</Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BasicModal;
