import React from 'react';
import { TemplateVariable } from './TemplateVariable';

interface Props {
  inputString: string;
}

function TemplateParser({ inputString }: Props) {
  const splitString = inputString.split(/\${(.*?)}/);
  console.log(splitString);
  return (
    <div>
      {splitString.map((part, index) => {
        if (index % 2 === 1) {
          // Wrap `${text}` in a div
          return (
            <span key={index}>
              <TemplateVariable label={part} />
            </span>
          );
        } else {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        }
      })}
    </div>
  );
}

export default TemplateParser;
