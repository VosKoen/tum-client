import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

export default function Navbar(props) {
  const {
    classes,
    handleClick,
    handleClose,
    handleClickLogout,
    anchorEl,
    handleClickRandomRecipe,
    handleClickMyAccount,
    handleClickMyRecipes
  } = props;
  return (
    <AppBar position="static">
      <Toolbar>
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
        <Typography variant="h1" className={classes.header}>
          Tum
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
