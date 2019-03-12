import * as React from "react";
import Grid from "@material-ui/core/Grid";
import FirstPageIcon from "@material-ui/icons/FirstPageRounded";
import LastPageIcon from "@material-ui/icons/LastPageRounded";
import ChevronLeft from "@material-ui/icons/ChevronLeftRounded";
import ChevronRight from "@material-ui/icons/ChevronRightRounded";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

export default function PaginationBar(props) {
  const {
    handleClickFirstPage,
    handleClickPreviousPage,
    handleClickNextPage,
    handleClickLastPage,
    itemsTotal,
    limit,
    offset
  } = props;

  return (
    <Grid container alignItems="center" spacing={8}>
      <Grid item>
        <IconButton
          onClick={handleClickFirstPage}
          disabled={offset === 0}
          size="small"
        >
          <FirstPageIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={handleClickPreviousPage} disabled={offset === 0}>
          <ChevronLeft />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography>
          {itemsTotal === 0 ? 0 : offset + 1} -{" "}
          {Math.min(itemsTotal, offset + limit)} of {itemsTotal}
        </Typography>
      </Grid>
      <Grid item>
        <IconButton
          onClick={handleClickNextPage}
          disabled={offset + limit === itemsTotal}
        >
          <ChevronRight />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={handleClickLastPage}
          disabled={offset + limit === itemsTotal}
        >
          <LastPageIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
