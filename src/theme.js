import { createMuiTheme } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";

export const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: green
  },
  typography: {
    useNextVariants: true
  },
  flatRoundIconButton: {
    color: "white",
    backgroundColor: red[500],
    height: "40px",
    width: "40px",
    padding: 0,
    "&:hover": {
      backgroundColor: red[500],
    }
  }
});
