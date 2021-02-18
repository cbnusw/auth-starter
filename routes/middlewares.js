const { verifyAccessToken } = require('../utils/jwt');
const { FORBIDDEN, LOGIN_REQUIRED } = require('../errors');

const requireAuthentication = async (req, res, next) => {
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

const requireRoles = (...roles) => [
  requireAuthentication,
  (req, res, next) => roles.includes(req.user.role) ? next() : next(FORBIDDEN)
];

exports.requireAuthentication = requireAuthentication;
exports.requireRoles = requireRoles;
