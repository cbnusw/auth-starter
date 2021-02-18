const { User, UserInfo } = require('./models');
const {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD: password,
  ADMIN_NAME: name,
  ADMIN_PHONE: phone
} = require('./env');

module.exports = async () => {
  const exAdmin = await User.findByEmail(email);
  if (!exAdmin) {
    const admin = await User.create({ email, password, role: 'admin' });
    const info = await UserInfo.create({ name, phone, email, user: admin._id });
    admin.info = info._id;
    await admin.save();
  }
}
