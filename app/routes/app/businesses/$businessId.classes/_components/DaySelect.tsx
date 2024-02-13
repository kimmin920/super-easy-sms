import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectProps } from '@radix-ui/react-select';
import { DayInString } from '~/types/day';

export const DAYS: DayInString[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

interface Props extends SelectProps {
  defaultValue: DayInString;
  onValueChange: (value: DayInString) => void;
  className?: string;
}

function DaySelect({
  defaultValue,
  onValueChange,
  className,
  ...props
}: Props) {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      {...props}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DAYS.map((day) => (
          <SelectItem key={day} value={day}>
            {day}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default DaySelect;
