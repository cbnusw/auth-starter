const { Router } = require('express');
const { isAuthenticated, hasRoles } = require('./middleware');
const controller = require('./controller');

const router = Router();

router.get('/me', isAuthenticated, controller.me);
router.get('/valid', isAuthenticated, controller.validateAccessToken);
router.get('/refresh-token', controller.refreshAccessToken);
router.get('/logout', isAuthenticated, controller.logout);

router.post('/login', controller.login);
router.post('/join', controller.join);
router.post('/operator/login', controller.loginOperator)
router.post('/operator/register', ...hasRoles('admin'), controller.registerOperator)

module.exports = router;