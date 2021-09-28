import { body } from "express-validator";
import createHttpError from "http-errors";
import { getProducts } from "../fs-tools.js";

export const productValidation = [
  body("name").exists().withMessage("name is a mandatory field!"),
  body("description").exists().withMessage("description is a mandatory field!"),
  body("brand").exists().withMessage("brand is a mandatory field!"),
  body("price").exists().isNumeric().withMessage("price is a mandatory field!"),
  body("category").exists().withMessage("category is a mandatory field!"),
];

export const prodIcCheck = async (req, res, next) => {
  const products = await getProducts();
  const check = products.some((prd) => prd.id == req.params.id);
  if (check) {
    next();
  } else {
    next(createHttpError(400, "Bad request, no such post!"));
  }
};
