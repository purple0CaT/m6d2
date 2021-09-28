export const customErrHand = (err, req, res, next) => {
  if (err.status >= 400 && err.status <= 499) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
};
export const genericErrHandl = (err, req, res, next) => {
  res.status(500).send("Generic Server Error");
};
