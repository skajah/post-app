module.exports = function (req, res, next) {
  let { likeDelta } = req.query;
  if (!likeDelta) return res.status(400).send('Specify "likeDelta" in query');
  likeDelta = likeDelta.trim();

  if (likeDelta === '-1') req.likeDelta = -1;
  else if (likeDelta === '1') req.likeDelta = 1;
  else return res.status(400).send('Expected likeDelta to be 1 or -1');
  next();
};
