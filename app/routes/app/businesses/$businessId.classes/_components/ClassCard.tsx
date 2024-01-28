import { cn } from '@/lib/utils';
// import { Class } from '@/stores/useClass';
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuSeparator,
//   ContextMenuSub,
//   ContextMenuSubContent,
//   ContextMenuSubTrigger,
//   ContextMenuTrigger,
// } from "@/registry/new-york/ui/context-menu"

interface ClassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  // NOTE: temp
  album: any;
  aspectRatio?: 'portrait' | 'square';
  width?: number;
  height?: number;
}

export function ClassCard({
  album,
  aspectRatio = 'portrait',
  width,
  height,
  className,
  ...props
}: ClassCardProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <div className='overflow-hidden rounded-md'>
        <img
          src={album.coverImgSrc}
          alt={album.name}
          width={width}
          height={height}
          className={cn(
            'h-auto w-auto object-cover transition-all hover:scale-105',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )}
        />
      </div>

      <div className='space-y-1 text-sm'>
        <h3 className='font-medium leading-none'>{album.name}</h3>
        <p className='text-xs text-muted-foreground'>{album.teacher}</p>

        <span className='mr-2 text-xl font-bold'>
          {new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
          }).format(album.price)}
        </span>
        <span className='text-gray-500 dark:text-gray-400'>
          {album.priceDescription}
        </span>
      </div>
    </div>
  );
}
