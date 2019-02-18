export const baseUrl = "http://localhost:4000";
export const localStorageJwtKey = "currentUserJwt";

export const imagePlaceholder = "https://res.cloudinary.com/fox-app-development/image/upload/v1550050963/tum/image-placeholder-350x350.png"
export const maxWidth = 350
// Constants which should be retrieved somehow from the database

export const amountTypes = [
    {
      id: 1,
      name: "amount",
      units: []
    },
    {
      id: 2,
      name: "volume",
      units: [ "ml.", "l."]
    },
    {
      id: 3,
      name: "weight",
      units: ["kg.","gr."]
    }
  ];

