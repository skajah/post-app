module.exports = function (req, res, next) {
  let { maxDate, limit } = req.query;

  if (!limit)
    return res
      .status(400)
      .send('"limit" is required to calculate number of items to return');

  limit = parseInt(limit, 10);
  if (isNaN(limit) || limit <= 0)
    return res.status(400).send('"limit" must be a positive integer');

  if (!maxDate) maxDate = new Date();
  else {
    maxDate = new Date(maxDate);
    if (maxDate.toString() === 'Invalid Date')
      return res.status(400).send('"maxDate" must be a valid Date');
  }

  req.query.maxDate = maxDate;
  req.query.limit = limit;

  next();
};
