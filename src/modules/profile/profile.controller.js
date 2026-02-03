import { ProfileService } from "./profile.service.js";

export const ProfileController = {

    /*
        * Get user profile information   
    */
    async get(req, res, next) {
        try {
            const user = req.user;
            const result = await ProfileService.getProfileById(user.id);
            console.log(result);
            if (!result) {
                return next({ message: 'Informatiile nu au fost gasite', status: 404 });
            }
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next({ message: 'Server error', error: error.message});
        }
    },
    
    /*
        * Update user profile information   
    */
    async update(req, res, next) {
        try {
            const user = req.user;
            const profileData = req.body;   

            const result = await ProfileService.updateProfile(user.id, profileData);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next({ message: 'Server error', error: error.message, status: 500 });
        }   
    }
};