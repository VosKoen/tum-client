export const baseUrl =
  process.env.REACT_APP_SERVER_URL || "http://localhost:4000";
export const localStorageJwtKey = "currentUserJwt";

export const imagePlaceholder =
  "https://res.cloudinary.com/fox-app-development/image/upload/c_scale,w_800/v1550050963/tum/image-placeholder-350x350.png";
export const maxImageWidth = 800;
export const sizeLoadingSymbol = 60;

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

//Set initial limit and offset for My Recipes
export const startLimit = 5;
export const startOffset = 0;

//Filters
export const filters = [
  {
    id: "preparationTime",
    options: [
      { value: "", label: "Any time" },
      { value: "20", label: "20 minutes or less" },
      { value: "30", label: "30 minutes or less" },
      { value: "60", label: "1 hour or less" },
      { value: "180", label: "3 hours or less" }
    ]
  }
];
