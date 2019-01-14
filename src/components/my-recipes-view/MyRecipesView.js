import * as React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function MyRecipesView(props) {
  const { classes, myRecipes } = props;
  
  if (!myRecipes) return (<div>Loading...</div>)
  return (
    <List>
      {myRecipes.map((recipe,index) => (
        <ListItem key={index} disableGutters={true} divider>
          <ListItemText primary={recipe.title} />
        </ListItem>
      ))}
      </List>
  );
}
