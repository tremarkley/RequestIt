const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  res.status(500).send({ error: 'Something went wrong' });
};

module.exports = {
  logErrors,
  errorHandler,
};
