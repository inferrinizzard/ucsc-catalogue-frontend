import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { TypographyProps } from '@material-ui/core/Typography';
import styled from 'styled-components';

const Block = styled.div`
  display: inline-block;
  width: 50%;
`;

export interface TextBlockProps {
  text: string;
  type: TypographyProps['variant'];
}

const TextBlock: React.SFC<TextBlockProps> = props => {
  return (
    <Block>
      <Typography variant={props.type as any}>{props.text}</Typography>
    </Block>
  );
};

export default TextBlock;
