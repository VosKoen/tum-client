import * as React from "react";
import Grid from "@material-ui/core/Grid";
import FirstPageIcon from "@material-ui/icons/FirstPageRounded";
import LastPageIcon from "@material-ui/icons/LastPageRounded";
import ChevronLeft from "@material-ui/icons/ChevronLeftRounded";
import ChevronRight from "@material-ui/icons/ChevronRightRounded";
import { Typography, ButtonBase } from "@material-ui/core";

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
    <Grid container>
      <ButtonBase onClick={handleClickFirstPage}>
        <FirstPageIcon />
      </ButtonBase>
      <ButtonBase onClick={handleClickPreviousPage}>
        <ChevronLeft />
      </ButtonBase>

      <Typography>{offset+1} - {offset+limit} of {itemsTotal}</Typography>
      <ButtonBase onClick={handleClickNextPage}>
        <ChevronRight />
      </ButtonBase>
      <ButtonBase onClick={handleClickLastPage}>
        <LastPageIcon />
      </ButtonBase>
    </Grid>
  );
}
