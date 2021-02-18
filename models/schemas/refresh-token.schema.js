const { Schema } = require('mongoose');
const { createSchema } = require('./helpers');
const { JWT_REFRESH_TOKEN_EXPIRES_IN } = require('../../env');

const schema = createSchema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  value: String, // refresh token 저장
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: JWT_REFRESH_TOKEN_EXPIRES_IN }
  }
}, {
  timestamps: false
});

schema.index({ user: 1, value: 1 }, { unique: true });

schema.statics.findByUser = function (user) {
  return this.find({ user });
}

schema.statics.updateToken = async function (user, token, oldToken = null) {
  if (oldToken) {
    await this.deleteOne({ user, value: oldToken });
  }
  await this.create({ user, value: token });
}

schema.statics.removeToken = function (user, token) {
  return this.deleteOne({ user, value: token });
}

module.exports = schema;
