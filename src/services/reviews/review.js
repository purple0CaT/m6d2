import express from "express";
import { getReviews, writeReviews } from "../fs-tools.js";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import { postValidation, reviewIdCheck } from "./MiddleWare.js";
import { validationResult } from "express-validator";
import { pool } from "../../utils/db.js";

const reviewsAmazn = express.Router();

// === GETT
reviewsAmazn.get("/", async (req, res, next) => {
  try {
    const query = `SELECT * FROM reviews ORDER BY id ASC `;
    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    next(error);
  }
});
// === GETT ID
reviewsAmazn.get("/:revId", async (req, res, next) => {
  try {
    const query = `SELECT * FROM reviews WHERE id=${req.params.revId} `;
    const result = await pool.query(query);
    res.status(200).send(result.rows);
  } catch (error) {
    next(error);
  }
});
// === POST
reviewsAmazn.post("/", postValidation, async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    try {
      const { comment, rate, product_id } = req.body;
      const query = `INSERT INTO reviews(
        comment,
        rate,
        product_id
      )
      VALUES(
        ${"'" + comment + "'"},
        ${"'" + rate + "'"},
        ${"'" + product_id + "'"}
      ) RETURNING *`;
      const result = await pool.query(query);
      if (result.rows.length > 0) {
        res.status(201).send(result.rows[0]);
      } else {
        res.status(404).send({ message: "Not found!" });
      }
    } catch (error) {
      next(error);
    }
  }
});
// === PUT
reviewsAmazn.put("/:comentId", postValidation, async (req, res, next) => {
  const errorList = validationResult(req);
  if (!errorList.isEmpty()) {
    next(createHttpError(400, { errorList }));
  } else {
    try {
      const { comment, rate, product_id } = req.body;
      const query = `
        UPDATE reviews
        SET
          comment=${"'" + comment + "'"},
          rate=${"'" + rate + "'"},
          product_id=${"'" + product_id + "'"}
        WHERE  id=${"'" + req.params.comentId + "'"}
        RETURNING *`;
      const result = await pool.query(query);
      res.status(201).send(result.rows[0]);
    } catch (err) {
      next(createHttpError(401, "Bad request"));
    }
  }
});
//  === DELETE
reviewsAmazn.delete("/:comentId", async (req, res, next) => {
  try {
    const query = `DELETE FROM reviews WHERE id=${
      "'" + req.params.comentId + "'"
    }`;
    await pool.query(query);
    res.status(204).send();
  } catch (err) {
    next(createHttpError(500, ""));
  }
});
export default reviewsAmazn;
