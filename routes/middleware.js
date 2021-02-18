const { verifyAccessToken } = require('../utils/jwt');
const { FORBIDDEN, LOGIN_REQUIRED } = require('../errors');

const isAuthenticated = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    try {
      req.user = await verifyAccessToken(token);
    } catch (e) {
      delete req.user;
      return next(e);
    }
  }
  if (!req.user) return next(LOGIN_REQUIRED);
  next();
};

const hasRoles = (...roles) => [
  isAuthenticated,
  (req, res, next) => roles.includes(req.user.role) ? next() : next(FORBIDDEN)
];

exports.isAuthenticated = isAuthenticated;
exports.hasRoles = hasRoles;
