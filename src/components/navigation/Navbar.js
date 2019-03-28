import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

export default function Navbar(props) {
  const {
    classes,
    handleClick,
    handleClose,
    handleClickLogout,
    anchorEl,
    handleClickRandomRecipe,
    handleClickMyAccount,
    handleClickMyRecipes,
    renderReportButtons
  } = props;
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={1} sm={4}>
            <Grid container justify="flex-start">
              <IconButton
                color="inherit"
                aria-label="Menu"
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClickRandomRecipe}>
                  Give me a recipe
                </MenuItem>
                <MenuItem onClick={handleClickMyRecipes}>Cookbook</MenuItem>
                <MenuItem onClick={handleClickMyAccount}>My account</MenuItem>

                <MenuItem onClick={handleClickLogout}>Logout</MenuItem>
              </Menu>
            </Grid>
          </Grid>
          <Grid item xs={10} sm={4}>
            <Typography variant="h1" className={classes.header}>
              Tum
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderReportButtons()}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
