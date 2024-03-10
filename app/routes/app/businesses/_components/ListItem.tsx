type Props = {
  title: string;
  description: string;
  onClick: () => void;
};

function ListItem({ title, description, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      role='navigation'
      className='gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent'
    >
      <div className='font-semibold'>{title}</div>
      <div className='line-clamp-2 text-xs text-muted-foreground'>
        {description}
      </div>
    </div>
  );
}

export default ListItem;
