const { getUserById } = require('../services/user.service'); // Example user service
const { getPermissionByName } = require('../services/permission.service'); // Example permission service

/**
 * Middleware to authorize user based on required permission.
 * Usage: authorize('PERMISSION_NAME')
 */
function authorize(requiredPermission) {
    return async (req, res, next) => {
        try {
            const userId = req.user && req.user.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await getUserById(userId);
            if (!user || !user.roles) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Aggregate permissions from all roles
            const userPermissions = user.roles
                .flatMap(role => role.permissions || []);

            // Check if user has the required permission
            const hasPermission = userPermissions.includes(requiredPermission);

            if (!hasPermission) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}

module.exports = authorize;