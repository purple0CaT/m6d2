import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// =
const { readJSON, writeJSON, writeFile } = fs;
// path Posts
const reviewsFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "./reviews"
);
export const reviewsJson = join(reviewsFolder, "reviewsLib.json");
// Posts
export const getReviews = () => readJSON(reviewsJson);
export const writeReviews = (content) => writeJSON(reviewsJson, content);
// ==
// PRODUCTS
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productsJSONPath = join(dataFolderPath, "products.json");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (content) => writeJSON(productsJSONPath, content);

export const publicPathFolder = join(process.cwd(), "/public/img");
export const savePhoto = (name, content) => {
  writeFile(join(publicPathFolder, name), content);
};
