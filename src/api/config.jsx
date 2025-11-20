// src/api/config.jsx
const config = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL, // dynamically loads from .env
};
export default config;

 export const Image_BASE_URL= import.meta.env.VITE_IMAGE_BASE_URL // dynamically loads from .env