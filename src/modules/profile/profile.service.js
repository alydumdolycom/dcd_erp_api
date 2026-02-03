import { UserModel } from "../users/users.model.js";
import { ProfileModel } from "./profile.model.js";
import { addError } from "../../utils/validators.js";

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
        
        return await profile || null;
    },
    
    async updateProfile(userId, profileData) {
        const errors = {};
        // Simulate updating profile in a database
        const result = await ProfileModel.findById(userId);
        if(!result) {
            addError(errors, "profil", "Profilul nu a fost gasit.");
        }

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        const rows = await ProfileModel.update(userId, profileData);
        return rows;
    }
};