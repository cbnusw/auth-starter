const bcrypt = require('bcrypt');
const { Schema } = require('mongoose');
const { createSchema } = require('./helpers');

const schema = createSchema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  hashedPassword: String,
  role: {
    type: String,
    enum: ['admin', 'operator', 'member'],
    default: 'member'
  },
  info: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    default: null,
  }
}, {
  createdAt: 'joinedAt',
  updatedAt: false,
});

schema.virtual('password')
  .set(function (password) {
    this.hashedPassword = bcrypt.hashSync(password, 12);
  });

schema.virtual('profile')
  .get(function () {
    return {
      _id: this._id,
      role: this.role,
    }
  });

schema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
}

schema.statics.findByEmail = function (email, cb) {
  return this.findOne({ email }, cb);
}

module.exports = schema;
