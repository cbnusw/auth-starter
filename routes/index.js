const { Router } = require('express');
const { requireAuthentication, requireRoles } = require('./middlewares');
const controller = require('./controller');

const router = Router();

router.get('/me', requireAuthentication, controller.me);
router.get('/valid', requireAuthentication, controller.validateAccessToken);
router.get('/refresh-token', controller.refreshAccessToken);
router.get('/logout', requireAuthentication, controller.logout);

router.post('/login', controller.login);
router.post('/join', controller.join);
router.post('/operator/login', controller.loginOperator)
router.post('/operator/register', ...requireRoles('admin'), controller.registerOperator)

module.exports = router;