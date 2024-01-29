import React from 'react';
import { TemplateVariable } from './TemplateVariable';

import { parseContent } from '../utils';
interface Props {
  template: string;
}

function TemplateParser({ template }: Props) {
  const parsedTemplate = template ? JSON.parse(template) : null;

  const output = parseContent(parsedTemplate?.content);

  return (
    <div>
      {output.map((content, index) => {
        if (content.type === 'mention') {
          // Wrap `${text}` in a div
          return (
            <span key={index}>
              <TemplateVariable label={content.id ?? ''} />
            </span>
          );
        } else {
          return <React.Fragment key={index}>{content.text}</React.Fragment>;
        }
      })}
    </div>
  );
}

export default TemplateParser;
