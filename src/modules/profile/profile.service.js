export const ProfileService = {
    async getProfileById(userId) {
        // Simulate fetching profile from a database
        const profile = await ProfileModel.findById(userId);
        
        return profile || null;
    },
    async updateProfile(userId, profileData) {
        // Simulate updating profile in a database
        const profile = await ProfileModel.findById(userId);
        if (!profile) {
            return null;
        }
        
        return profile;    
    }
};