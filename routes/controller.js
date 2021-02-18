const { User, UserInfo, RefreshToken } = require('../models');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { createSuccessResponse } = require('./utils/response');
const {
  FORBIDDEN,
  INVALID_PASSWORD,
  PASSWORD_REQUIRED,
  PHONE_NUMBER_USED,
  TOKEN_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_USED,
  USER_NOT_FOUND,
  WITHDRAWN_USER,
} = require('../errors');

const me = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id)
      .select('-hashedPassword')
      .populate('info');

    if (!user) return next(USER_NOT_FOUND);
    res.json(createSuccessResponse(res, user));
  } catch (e) {
    next(e);
  }
};

const validateAccessToken = (req, res) => res.json(createSuccessResponse(res, req.user));

const refreshAccessToken = async (req, res, next) => {
  const oldRefreshToken = req.headers['x-refresh-token'];
  if (!oldRefreshToken) return next(TOKEN_REQUIRED);
  try {
    const id = await verifyRefreshToken(oldRefreshToken);
    const user = await User.findById(id);
    const accessToken = await signAccessToken(user.profile);
    const refreshToken = await signRefreshToken(id);
    await RefreshToken.updateToken(id, refreshToken, oldRefreshToken);
    res.json(createSuccessResponse(res, { accessToken, refreshToken }));
  } catch (e) {
    next(e);
  }
};

const login = (...roles) => async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return next(EMAIL_REQUIRED);
  if (!password) return next(PASSWORD_REQUIRED);

  try {
    const exUser = await User.findByEmail(email);
    if (!exUser) return next(USER_NOT_FOUND);
    if (!roles.includes('all') && !roles.includes(exUser.role)) return next(FORBIDDEN);
    if (!exUser.authenticate(password)) return next(INVALID_PASSWORD);

    const accessToken = await signAccessToken(exUser.profile);
    const refreshToken = await signRefreshToken(exUser._id);
    await RefreshToken.updateToken(exUser._id, refreshToken);

    res.json(createSuccessResponse(res, { accessToken, refreshToken }));
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const refreshToken = req.headers['x-refresh-token'];
  try {
    const id = await verifyRefreshToken(refreshToken);
    await RefreshToken.removeToken(id, refreshToken);
    res.json(createSuccessResponse(res));
  } catch (e) {
    next(e);
  }
};

const join = (...roles) => async (req, res, next) => {
  const { email, password, role = 'member', info } = req.body;
  const { phone } = info;

  if (!email) return next(EMAIL_REQUIRED);
  if (!password) return next(PASSWORD_REQUIRED);
  if (!roles.includes(role)) return next(FORBIDDEN);

  try {
    const exUser = await User.findByEmail(email);
    if (exUser) return next(EMAIL_USED);

    const exUserInfo = await UserInfo.findOne({ phone });
    if (exUserInfo) return next(PHONE_NUMBER_USED);

    const user = await User.create({ email, password, role });

    if (info) {
      info.email = email;
      const { _id: infoId } = await UserInfo.create({ ...info, user: user._id });
      user.info = infoId;
      await user.save();
    }
    res.json(createSuccessResponse(res));
  } catch (e) {
    next(e);
  }
};

exports.me = me;
exports.validateAccessToken = validateAccessToken;
exports.refreshAccessToken = refreshAccessToken;
exports.logout = logout;
exports.login = login('all');
exports.join = join('member');
exports.loginOperator = login('admin', 'operator');
exports.registerOperator = join('operator');
