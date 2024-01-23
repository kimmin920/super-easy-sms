import './styles.css';
import Mention from '@tiptap/extension-mention';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import suggestion from './suggestion.js';

interface TemplateEditorTipTapProps {
  defaultContent: JSONContent;
  onChange: (value: JSONContent) => void;
}

function TemplateEditorTipTap({
  defaultContent: content,
  onChange,
}: TemplateEditorTipTapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
    ],
    content,
    parseOptions: {},
    onUpdate: (editor) => onChange(editor.editor.getJSON()),
  });

  console.log(editor?.getJSON());

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}

export default TemplateEditorTipTap;
