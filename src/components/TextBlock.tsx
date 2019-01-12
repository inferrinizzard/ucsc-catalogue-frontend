import * as React from 'react';
import Typography from '@material-ui/Core/Typography';
import { TypographyProps } from '@material-ui/Core/Typography';
import styled from 'styled-components';

const Block = styled.div`
  display: inline-block;
  width: 50%;
`;

export interface TextBlockProps {
  text: string;
  type: TypographyProps;
}

const TextBlock: React.SFC<TextBlockProps> = props => {
  return (
    <Block>
      <Typography variant={props.type as any}>{props.text}</Typography>
    </Block>
  );
};

export default TextBlock;
