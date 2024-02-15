import React from 'react';
import { TemplateVariable } from './TemplateVariable';

import { parseContent } from '../utils';
import { Card } from '@/components/ui/card';
interface Props {
  template: string;
}

function TemplateParser({ template }: Props) {
  const parsedTemplate = template ? JSON.parse(template) : null;

  const output = parseContent(parsedTemplate?.content);

  return (
    <Card className='w-[300px] px-4 py-2 mt-2 rounded-md'>
      {output.map((content, index) => {
        if (content.type === 'mention') {
          return (
            <span key={index}>
              <TemplateVariable label={content.id ?? ''} />
            </span>
          );
        } else {
          return <React.Fragment key={index}>{content.text}</React.Fragment>;
        }
      })}
    </Card>
  );
}

export default TemplateParser;
