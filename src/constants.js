
export const baseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";
export const localStorageJwtKey = "currentUserJwt";


export const imagePlaceholder =
  "https://res.cloudinary.com/fox-app-development/image/upload/c_scale,w_800/v1550050963/tum/image-placeholder-350x350.png";
export const maxImageWidth = 800;
export const  sizeLoadingSymbol = 60;


// Constants which should be retrieved somehow from the database

export const amountTypes = [
  {
    id: 1,
    name: "number",
    units: []
  },
  {
    id: 2,
    name: "volume",
    units: ["ml.", "l."]
  },
  {
    id: 3,
    name: "weight",
    units: ["kg.", "g."]
  }
];

export const units = [
  { id: 1, name: "liter", shorthand: "l." },
  { id: 2, name: "milliliter", shorthand: "ml." },
  { id: 3, name: "kilogram", shorthand: "kg." },
  { id: 4, name: "gram", shorthand: "g." }
];
