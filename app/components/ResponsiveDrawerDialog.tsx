import * as React from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface ResponsiveDrawerDialogProps {
  button: React.ReactNode;
  form: React.ReactNode;
  title: string;
  description: string;
  closeText?: string;
}

export function ResponsiveDrawerDialog({
  button,
  form,
  title,
  description,
  closeText,
}: ResponsiveDrawerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>{button}</DialogTrigger>
        <DialogContent className='w-fit max-w-fit overflow-y-auto max-h-[calc(100vh-2rem)]'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {form}
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
