import * as React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Grid, Divider } from "@material-ui/core";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import PeopleIcon from "@material-ui/icons/People";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CircularProgress from "@material-ui/core/CircularProgress";
import { sizeLoadingSymbol } from "../../constants";

export default function RecipeView(props) {
  const {
    classes,
    recipe,
    renderRecipeSelectButtons,
    renderRecipeRating,
    renderEditDeleteButtons,
    renderPhotoButton,
    state
  } = props;

  if (recipe.title)
    return (
      <Card className={classes.card}>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <div className={classes.imageContainer}>
              <CardMedia
                component="img"
                src={recipe.imageUrl}
                title={recipe.title}
              />
              {renderPhotoButton()}
              {renderRecipeSelectButtons()}
              {renderRecipeRating()}
              {renderEditDeleteButtons()}
              {state.imageIsLoading ? (
                <CircularProgress
                  className={classes.loadingSymbol}
                  size={sizeLoadingSymbol}
                />
              ) : (
                ""
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{recipe.title}</Typography>
            <CardContent>
              <Grid
                container
                spacing={16}
                alignItems="center"
                justify="space-between"
              >
                <Grid item>
                  <Grid container spacing={16}>
                    <Grid item>
                      <Grid container spacing={8} alignItems="center">
                        <Grid item>
                          <TimelapseIcon />
                        </Grid>
                        <Grid item>
                          <Typography>{recipe.timeNeeded} min.</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={8} alignItems="center">
                        <Grid item>
                          <PeopleIcon />
                        </Grid>
                        <Grid item>
                          <Typography>{recipe.servings}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={8} alignItems="center">
                        <Grid item>
                          <ThumbUpIcon />
                        </Grid>
                        <Grid item>
                          <Typography>{recipe.rating}</Typography>
                        </Grid>{" "}
                          
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography>{recipe.username}</Typography>
                </Grid>
              </Grid>

              <Divider />
              <Typography component="p" align="left">
                {recipe.description}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
        <CardContent>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" align="left">
                Ingredients
              </Typography>
              <Divider />
              <List>
                {recipe.ingredients.map(ingredient => (
                  <ListItem key={ingredient.ingredientId} disableGutters={true}>
                    <Typography component="p" align="left">
                      {ingredient.amount} {ingredient.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" align="left">
                Steps
              </Typography>
              <Divider />
              <List>
                {recipe.steps.map(step => (
                  <ListItem key={step.id} disableGutters={true}>
                    <Typography component="p" align="left">
                      {step.description}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );

  return <div>Loading...</div>;
}
