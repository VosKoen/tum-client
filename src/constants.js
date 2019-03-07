
export const baseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";
export const localStorageJwtKey = "currentUserJwt";


export const imagePlaceholder =
  "https://res.cloudinary.com/fox-app-development/image/upload/c_scale,w_800/v1550050963/tum/image-placeholder-350x350.png";
export const maxImageWidth = 800;
export const  sizeLoadingSymbol = 60;

export const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

//Set initial limit and offset for My Recipes
export const startLimit = 5;
export const startOffset = 0;