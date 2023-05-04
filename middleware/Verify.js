const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).send("Invalid token");
      req.user = user;
      next();
    });
  }
};

const isAdmin = async (req, res, next) => {
  verify(req, res, async () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("You are not allowed to perform this action");
    }
  });
};

module.exports = { verify, isAdmin };
