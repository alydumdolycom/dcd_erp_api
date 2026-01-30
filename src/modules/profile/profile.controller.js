import { ProfileService } from "./profile.service.js";

export const ProfileController = {

    /*
        * Get user profile information   
    */
    async get(req, res, next) {
        try {
            const user = req.user;

            const data = await ProfileService.getProfileById(user.id);
            if (!data) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json({
                data
            });
        } catch (error) {
            next({ message: 'Server error', error: error.message});
        }
    },
    
    /*
        * Update user profile information   
    */
    async update(req, res) {
        try {
            const user = req.user;
            const profileData = req.body;   
            const updatedProfile = await ProfileService.updateProfileById(user.id, profileData);
            res.status(200).json(updatedProfile);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }   
    }
};