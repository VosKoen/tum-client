import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

export default function ReportDialog(props) {
  const { state, handleReportDialogClose, handleReport } = props;

  return (
    <Dialog open={state.reportDialogOpen} onClose={handleReportDialogClose}>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to report the {state.reportSubject}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleReport}
          color="primary"
        >
          Report {state.reportSubject}
        </Button>

        <Button onClick={handleReportDialogClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
