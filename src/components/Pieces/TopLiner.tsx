import * as React from 'react';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

export interface TopLinerProps {
  open: boolean;
  setAbout: (status: boolean) => void;
  height: number;
}

const TopLiner: React.SFC<TopLinerProps> = props => {
  return (
    <div
      style={{
        width: '100%',
        background: '#5d92dd',
        zIndex: 1201,
        position: 'fixed',
        top: '0',
      }}
    >
      <span>
        <Typography
          variant={'h6'}
          style={{
            height: props.height + 'px',
            display: 'inline',
            paddingLeft: '8px',
            fontWeight: 400,
          }}
        >
          CruzAssist
        </Typography>
      </span>
      <span style={{ float: 'right' }}>
        <Button size="small" onClick={e => props.setAbout(!props.open)}>
          <Typography>About</Typography>
        </Button>
      </span>
      <Collapse in={props.open}>
        <Typography>
          Made by Sean Song with special help from Shun Kashiwa
        </Typography>
        <Typography>Data provided by slugsurvival</Typography>
      </Collapse>
    </div>
  );
};

export default TopLiner;
