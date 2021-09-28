// http://localhost:3001/products
import express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { validationResult } from "express-validator";
import { productValidation } from "./validation.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { pool } from "../../utils/db.js";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, //authomatic read cloud URL
  params: {
    folder: "amazonTest-Img",
  },
});

const productsRouter = express.Router();
// get by category
productsRouter.get("/", async (req, res, next) => {
  try {
    const query = `SELECT * FROM products ORDER BY id ASC `;
    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const query = `SELECT * FROM products WHERE id=${
      "'" + req.params.id + "'"
    }`;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      res.status(200).send(result.rows);
    } else {
      res
        .status(404)
        .send({ message: `Author with ID:${req.params.id}, not found!` });
    }
  } catch (error) {
    next(error);
  }
});

// GET REVIEWS
// productsRouter.get("/:id/reviews", async (req, res, next) => {
//   try {
//     const reviews = await getReviews();
//     const filteredRev = reviews.filter((p) => p.productId === req.params.id);
//     res.send(filteredRev);
//   } catch (error) {
//     next(error);
//   }
// });
// REG POST
productsRouter.post("/", productValidation, async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, errorList));
  }
  try {
    const { name, description, brand, price, category } = req.body;
    const query = `INSERT INTO products(
      name,
      description,
      brand,
      price,
      category
    )
    VALUES(
      ${"'" + name + "'"},
      ${"'" + description + "'"},
      ${"'" + brand + "'"},
      ${"'" + price + "'"},
      ${"'" + category + "'"}
    ) RETURNING *`;
    const result = await pool.query(query);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
// == PUT
productsRouter.put("/:id", productValidation, async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, errorList));
  }
  try {
    const { name, description, brand, price, category } = req.body;
    const query = `
    UPDATE products
    SET
      name=${"'" + name + "'"},
      description=${"'" + description + "'"},
      brand=${"'" + brand + "'"},
      price=${"'" + price + "'"},
      category=${"'" + category + "'"},
      updated_at= NOW()
    WHERE  id=${req.params.id}
    RETURNING *`;
    console.log(123);
    const result = await pool.query(query);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
// ==  UPLOAD IMAGE
productsRouter.post(
  "/:id/uploadPhoto",
  multer({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype != "image/jpeg" && file.mimetype != "image/png")
        cb(createHttpError(400, "Format not suported!"), false);
      else cb(null, true);
    },
  }).single("image"),
  async (req, res, next) => {
    try {
      let urlPhoto = req.file.path;
      const query = `
      UPDATE products
      SET
      image_url =${"'" + urlPhoto + "'"},
      updated_at= NOW()
      WHERE  id=${req.params.id}
      RETURNING *`;
      const result = await pool.query(query);
      res.status(201).send(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);
// === DELETE
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const query = `DELETE FROM products WHERE id=${"'" + req.params.id + "'"}`;
    await pool.query(query);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
