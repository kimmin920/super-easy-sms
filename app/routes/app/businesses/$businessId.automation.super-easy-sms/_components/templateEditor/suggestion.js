import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import MentionList from './MentionList.jsx';

const KEYWORD_OPTIONS = [
  '학생이름',
  '정산시작일',
  '정산종료일',
  '정산금액',
  '정산내역',
];

export default {
  items: ({ query }) => {
    return KEYWORD_OPTIONS.filter((item) =>
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
