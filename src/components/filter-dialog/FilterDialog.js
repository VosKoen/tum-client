import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';


export default function FilterDialog(props) {
  const { state, open, close, handleChange, classes
  } = props;

  const [inputLabelRef, setInputLabelRef] = useState(undefined);
  const labelOffsetWidth = inputLabelRef
    ? ReactDOM.findDOMNode(inputLabelRef).offsetWidth
    : 0;


  return (
      <Dialog open={open} onClose={close}>
          <DialogTitle id="">Select filters</DialogTitle>
          <DialogContent>
          <FormControl variant="outlined" className={classes.select} margin="normal">
          <InputLabel
          ref={ref => setInputLabelRef(ref)}
          htmlFor="preparation-time"
          >
            Preparation time
          </InputLabel>
          <Select
            value={state.preparationTime}
            onChange={handleChange}
            input={
              <OutlinedInput
              labelWidth={labelOffsetWidth}
                name="preparationTime"
                id="preparation-time"
              />
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
          </DialogContent>
          <DialogActions>
          <Button onClick={close} color="primary">
              Cancel
            </Button>
            <Button onClick={() => console.log("click")} color="primary">
              Apply
            </Button>
        </DialogActions>
      </Dialog>

  );
}
