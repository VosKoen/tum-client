import React, { useState } from "react";
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { filters } from "../../constants";

export default function FilterDialog(props) {
  const { state, open, handleClose, handleChange, classes, handleApply } = props;

  const [inputLabelRef, setInputLabelRef] = useState(undefined);
  const labelOffsetWidth = inputLabelRef
    ? ReactDOM.findDOMNode(inputLabelRef).offsetWidth
    : 0;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="">Select filters</DialogTitle>
      <DialogContent>
        <FormControl
          variant="outlined"
          className={classes.select}
          margin="normal"
        >
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
            {filters
              .find(filter => filter.id === "preparationTime")
              .options.map((option,index) => (
                <MenuItem key={index} value={option.value}>{option.value ? option.label: <em>{option.label}</em>}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleApply} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
