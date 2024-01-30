import { cn } from '@/lib/utils';
import { Class } from '../_mockdata';

interface ClassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  // NOTE: temp
  course: Class;
  aspectRatio?: 'portrait' | 'square';
  width?: number;
  height?: number;
}

export function ClassCard({
  course,
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
          src={course.coverImgSrc}
          alt={course.name}
          width={width}
          height={height}
          className={cn(
            'h-auto w-auto object-cover transition-all hover:scale-105',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )}
        />
      </div>

      <div className='space-y-1 text-sm'>
        <h3 className='font-medium leading-none'>{course.name}</h3>
        <p className='text-xs text-muted-foreground'>{course.teacher}</p>

        <span className='mr-2 text-xl font-bold'>
          {new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
          }).format(course.price)}
        </span>
        <span className='text-gray-500 dark:text-gray-400'>
          /{course.billingFrequency}
        </span>
      </div>
    </div>
  );
}
