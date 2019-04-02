export const baseUrl =
  process.env.REACT_APP_SERVER_URL || "http://192.168.192.38:4000";
export const localStorageJwtKey = "currentUserJwt";

export const imagePlaceholder =
  "https://res.cloudinary.com/fox-app-development/image/upload/c_fill,h_600,w_800,g_auto/v1550050963/tum/image-placeholder-350x350.png";
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
