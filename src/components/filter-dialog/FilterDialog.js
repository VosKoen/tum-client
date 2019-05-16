import React, { useState } from "react";
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { filters } from "../../constants";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import { Divider } from "@material-ui/core";

export default function FilterDialog(props) {
  const {
    state,
    open,
    handleClose,
    handleChange,
    classes,
    handleApply,
    handleCheck,
    availableLabels
  } = props;

  const [inputLabelRef, setInputLabelRef] = useState(undefined);
  const labelOffsetWidth = inputLabelRef
    ? ReactDOM.findDOMNode(inputLabelRef).offsetWidth
    : 0;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="">Select filters</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={8}>
          <Grid item>
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
                  .options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.value ? option.label : <em>{option.label}</em>}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.filterOnLabels}
                  onChange={handleCheck}
                  name="filterOnLabels"
                  id="filterOnLabels"
                />
              }
              label="Results must include at least one of the following labels"
            />
          </Grid>
          <Grid item>
            <FormControl component="fieldset">
              <FormLabel component="legend">Labels</FormLabel>
              <FormGroup>
                {availableLabels.map(label => (
                  <FormControlLabel
                    key={label.id}
                    control={
                      <Checkbox
                        checked={state[label.labelName]}
                        onChange={handleCheck}
                        name={label.labelName}
                        id={label.labelName}
                      />
                    }
                    label={label.labelName}
                    disabled={!state.filterOnLabels}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.filterOnLabelsAll}
                  onChange={handleCheck}
                  name="filterOnLabelsAll"
                  id="filterOnLabelsAll"
                />
              }
              label="Results must include all of the following labels"
            />
          </Grid>
          <Grid item>
            <FormControl component="fieldset">
              <FormLabel component="legend">Labels</FormLabel>
              <FormGroup>
                {availableLabels.map(label => (
                  <FormControlLabel
                    key={label.id}
                    control={
                      <Checkbox
                        checked={state[`${label.labelName}AndCondition`]}
                        onChange={handleCheck}
                        name={`${label.labelName}AndCondition`}
                        id={`${label.labelName}AndCondition`}
                      />
                    }
                    label={label.labelName}
                    disabled={!state.filterOnLabelsAll}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

        </Grid>
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
