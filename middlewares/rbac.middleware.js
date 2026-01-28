const PERMISSIONS = require('../config/permissions');

exports.can = (permission) => {
    return (req, res, next) => {
        const rolePerms = PERMISSIONS[req.user.role] || [];
        if (rolePerms.includes('*') || rolePerms.includes(permission)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden' });
    };
};