import * as React from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface ResponsiveDrawerDialogButtonProps {
  button: React.ReactNode;
  form: React.ReactNode;
  title: string;
  description: string;
  closeText?: string;
}

export function ResponsiveDrawerDialogButton({
  button,
  form,
  title,
  description,
  closeText,
}: ResponsiveDrawerDialogButtonProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>{button}</DialogTrigger>
        <DialogContent className='w-fit max-w-fit overflow-y-scroll max-h-[calc(100vh-2rem)]'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {form}
          <DialogFooter>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setOpen(false)}
            >
              {closeText ?? 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className='px-4 max-h-96 overflow-y-auto'>{form}</div>
        <DrawerFooter className='pt-2'>
          <DrawerClose asChild>
            <Button variant='outline'>{closeText ?? 'Cancel'}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface ResponsiveDrawerDialogProps {
  content: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export function ResponsiveDrawerDialog({
  isOpen,
  content,
  title,
  description,
  footer,
  onOpenChange,
}: ResponsiveDrawerDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
        <DialogContent className='w-fit max-w-fit overflow-y-scroll max-h-[calc(100vh-2rem)]'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className='px-4 max-h-96 overflow-y-auto'>{content}</div>
        {footer && <DrawerFooter className='pt-2'>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
