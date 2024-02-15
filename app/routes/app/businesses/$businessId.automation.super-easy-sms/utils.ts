import { JSONContent } from '@tiptap/react';
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

export interface ContentItem {
  type: string;
  id?: string;
  label?: string;
  text?: string;
}

export function parseContent(content: JSONContent['content']) {
  const result: ContentItem[] = [];

  if (!content) {
    return [];
  }

  for (const item of content) {
    if (item.type === 'paragraph') {
      result.push({ type: 'space' }, ...parseContent(item.content));
    } else if (item.type === 'mention') {
      result.push({
        type: 'mention',
        id: item.attrs?.id,
        label: item.attrs?.label,
        text: item.text,
      });
    } else if (item.type === 'text') {
      result.push(item as ContentItem);
    }
  }

  return result;
}

export function templateMessageInjector(
  content: JSONContent['content'],
  mentionValueMap: Record<string, unknown>
) {
  console.log(content)
  if (!content) {
    return null;
  }

  const parsed = parseContent(content);

  const result = parsed
    .map((each) => {
      if (each.type === 'space') {
        return ' ';
      }

      if (each.type === 'text') {
        return each.text;
      }

      if (each.type === 'mention') {
        const value = each.id ? mentionValueMap[each.id] : 'ERROR-NO-ID';
        return value;
      }

      return each.text;
    })
    .join('');

  return result;
}
