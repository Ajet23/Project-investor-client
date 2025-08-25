export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  const msg = process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message;
  res.json({
    message: msg,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
