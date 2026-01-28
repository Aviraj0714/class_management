const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const { can } = require('../middlewares/rbac.middleware');
const ctrl = require('../controllers/auth.controller');

router.post('/register', auth, can('USER_CREATE'), ctrl.register);
router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password/:token', ctrl.resetPassword);

module.exports = router;