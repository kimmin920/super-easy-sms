import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import './tippyStyle.css';
import MentionList from './MentionList.jsx';

const queryOptions = flattenObject({
  student: {
    id: '2',
    name: 'Jeff',
    lastName: 'Bezos',
    email: 'vv@cc',
    phoneNumber: '01097690373',
    classes: ['piano-b', 'violine-a'],
    totalPrice: 270000,
    status: 'pending',
    classesWithPayment: [
      {
        id: 'piano-b',
        name: 'Piano-B',
        coverImg:
          'https://ui.shadcn.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1611348586804-61bf6c080437%3Fw%3D300%26dpr%3D2%26q%3D80&w=640&q=75',
        teacher: 'hyunkyung kim',
        description: '',
        price: 200000,
        priceDescription: '/월',
        days: ['Monday', 'Wednesday'],
        numberOfClass: 4,
        pricePerClass: 20000,
        activeClassDates: [
          '2022-01-23T15:00:00.000Z',
          '2022-01-25T15:00:00.000Z',
          '2022-01-30T15:00:00.000Z',
          '2022-02-01T15:00:00.000Z',
          '2022-02-06T15:00:00.000Z',
          '2022-02-08T15:00:00.000Z',
        ],
        priceOfCounts: 120000,
      },
      {
        id: 'violine-a',
        name: 'Violine-A',
        coverImg:
          'https://ui.shadcn.com/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1468817814611-b7edf94b5d60%3Fw%3D300%26dpr%3D2%26q%3D80&w=640&q=75',
        teacher: 'hyunkyung kim',
        description: '',
        price: 300000,
        priceDescription: '/월',
        days: ['Monday'],
        numberOfClass: 1,
        pricePerClass: 50000,
        activeClassDates: [
          '2022-01-23T15:00:00.000Z',
          '2022-01-30T15:00:00.000Z',
          '2022-02-06T15:00:00.000Z',
        ],
        priceOfCounts: 150000,
      },
    ],
    message:
      'Jeff 어머니, 안녕하세요! 즐거운 돈내는 날입니다. Jeff의 이번 정산기간 2022년 1월 20일 ~ 2022년 2월 9일의 비용은 ₩270,000 입니다. 즐거운 한가위 보내세요 호호',
  },
});

export default {
  items: ({ query }) => {
    return queryOptions.filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        // component.element.className = 'px-4 max-h-52 overflow-y-auto';

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          allowHTML: true,
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

function flattenObject(obj, parentKey = '') {
  let result = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively call the function for nested objects
        result = result.concat(flattenObject(obj[key], currentKey));
      } else {
        // Add the current key to the result array
        result.push(currentKey);
      }
    }
  }

  return result;
}
