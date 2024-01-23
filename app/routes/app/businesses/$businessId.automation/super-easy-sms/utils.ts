import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const getDatesBetween = (
  dateRange: DateRange,
  holidays: Date[]
): Date[] => {
  const { from, to } = dateRange;
  const dates = [];
  let currentDate = new Date(from);

  while (currentDate <= to) {
    // Exclude weekends and holidays
    if (
      !holidays.some((holiday) => holiday.getTime() === currentDate.getTime())
    ) {
      dates.push(new Date(currentDate));
    }

    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

export class TemplateHandler {
  private value: string;
  private splittedValue: string[] | null;
  private availableKeyWords: string[] | null;

  constructor(input: string) {
    this.value = input;
    this.splittedValue = null;
    this.availableKeyWords = null;
  }

  split(): this {
    const splitString = this.value.split(/\${(.*?)}/);
    this.splittedValue = splitString;
    this.availableKeyWords = splitString.filter((_each, index) => {
      if (index % 2 === 1) {
        return true;
      }
      return false;
    });

    return this;
  }

  replace(keyword: string, value: string): this {
    if (!this.splittedValue) {
      throw Error('do split first');
    }

    if (!this.availableKeyWords) {
      throw Error('no keyword available');
    }

    const hasKeyword = this.availableKeyWords.find((each) => each === keyword);

    if (!hasKeyword) {
      throw Error(`${keyword} is not exist`);
    }

    this.splittedValue = this.splittedValue.map((each) => {
      if (each === keyword) {
        return value;
      }

      return each;
    });

    return this;
  }

  getParsedMessage(): string {
    if (this.splittedValue) {
      return this.splittedValue.join('');
    }

    return '';
  }
}
