import { ProfileService } from "./profile.service";

export const ProfileController = {
    async getProfile(req, res) {
        try {
            const user = req.user;

            const profile = await ProfileService.getProfileById(user.id);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    async updateProfile(req, res) { 
        try {       
            const user = req.user;
            const profileData = req.body; 
            const updatedProfile = await ProfileService.updateProfile(user.id, profileData); 
            if (!updatedProfile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.status(200).json(updatedProfile);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};