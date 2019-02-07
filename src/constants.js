export const baseUrl = "http://localhost:4000";
export const localStorageJwtKey = "currentUserJwt";

export const imageUrl = ""
export const imagePlaceholder = "https://ik.imagekit.io/foxAppDevImages/image-placeholder-350x350_SyVxCduEV.png"

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

export const ingredientNames = [
  {
    id: 1,
    name: "Spaghetti"
  },
  {
    id: 2,
    name: "Tomatoes"
  },
  {
    id: 3,
    name: "Eggs"
  }
];
