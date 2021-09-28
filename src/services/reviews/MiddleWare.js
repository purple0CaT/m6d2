import { body } from "express-validator";
import createHttpError from "http-errors";
import { getReviews } from "../fs-tools.js";

export const reviewIdCheck = async (req, res, next) => {
  const reviews = await getReviews();
  const check = reviews.some((rev) => rev._id == req.params.comentId);

  if (check) {
    next();
  } else {
    next(createHttpError(400, "Bad request, no such post!"));
  }
};

// POST
export const postValidation = [
  body("comment")
    .exists()
    .notEmpty()
    .withMessage("Comment is a mandatory field!"),
  body("rate")
    .exists()
    .notEmpty()
    .isNumeric()
    .withMessage("Rate is a mandatory field!"),
];
