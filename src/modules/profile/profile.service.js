import { UserModel } from "../users/users.model.js";
import { ProfileModel } from "./profile.model.js";

export const ProfileService = {
    async getProfileById(userId) {
        // Simulate fetching profile from a database
        const profile = await ProfileModel.findById(userId);
        const roles = await UserModel.userRolesWithPermissions(userId);
        const permissions = await UserModel.getUserPermissions(userId);
        
        if (profile) {
            profile.permissions = permissions;
        }
        if (profile) {
            profile.roles = roles;
        }
        
        return profile || null;
    },
    
    async updateProfile(userId) {
        // Simulate updating profile in a database
        const profile = await ProfileModel.findById(userId);
        if (!profile) {
            return null;
        }
        
        return profile;    
    },

    async updateProfileById(userId, profileData) {
        // Simulate updating profile in a database
        const profile = await ProfileModel.update(userId, profileData);
        return profile;
    }
};