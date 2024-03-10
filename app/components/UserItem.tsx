import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Check } from 'lucide-react';
import React from 'react';

type UserItemProps = {
  id: number;
  avatar?: string;
  name: string;
  caption: string;
};

function UserItem(user: UserItemProps) {
  return (
    <div key={user.id} className='flex items-center px-2'>
      <Avatar>
        {user.avatar && <AvatarImage src={user.avatar} alt='Image' />}
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div className='ml-2'>
        <p className='text-sm font-medium leading-none'>{user.name}</p>
        <p className='text-sm text-muted-foreground'>{user.caption}</p>
      </div>
    </div>
  );
}

export default UserItem;
