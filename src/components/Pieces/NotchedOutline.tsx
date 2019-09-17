import * as React from 'react';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';

export interface NotchedOutlineProps {
  inner?: JSX.Element;
  width: number;
  title: string;
}

const Fieldset = styled.fieldset`
	padding: 0;
	margin: 0;
	transition: border-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.23);

  &:hover(border-color: black;)
  &:focus(border-color: #3f51b5; border-width: 2px;)`;

const Legend = styled.legend`
  padding: 0;
  margin-left: 8px;
  text-align: left;
  transition: width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  line-height: 11px;
`;

const NotchedOutline: React.SFC<NotchedOutlineProps> = props => {
  return (
    <Fieldset>
      <Legend style={{ width: props.width + 'px' }}>
        <Typography style={{ display: 'inline' }}>{props.title}</Typography>
      </Legend>
      {props.inner ? props.inner : props.children}
    </Fieldset>
  );
};

export default NotchedOutline;
