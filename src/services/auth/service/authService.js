import jwt from 'jsonwebtoken';
import AppError from '../../../shared/utils/AppError.js';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/config/logger.js';

export class AuthService{
    constructor(UserRepository){
        if(!UserRepository){
            throw new Error("User Repository is required");
        }
        this.UserRepository = UserRepository
    }

    generateToken(user){
        const {_id, email, username, role, clientId } = user;

        const payload ={
            userId: _id,
            username,
            email,
            role,
            clientId,
        }

        return jwt.sign(payload, config.jwt.secret,{
            expiresIn: config.jwt.expiresIn
        })
    }

    // formatUserForResponse(user){
    //     const userObj = user.toObject() ? user.toObject() : {...user}
    //     delete userObj.password;
    //     return userObj;
    // }

    formatUserForResponse(user) {
    const userObj =
        typeof user.toObject === "function"
            ? user.toObject()
            : { ...user };

        delete userObj.password;
        return userObj;
    }

    async onboardSuperAdmin(superAdmin){
        try {
            const existingUser = await this.UserRepository.findAll();

            if(existingUser && existingUser.length > 0){
                throw new Error("Super Admin onboarding is Disabled", 403)
            }

            const user = await this.UserRepository.create(superAdmin);

            const token = this.generateToken(user);
            logger.info("Super Admin onboarded successfully",{
                username: user.username
            })

            return {
                user: this.formatUserForResponse(user),
                token
            }
        } catch (error) {
            logger.error("Error while onBoarding superAdmin", error)
            throw error;
        }
    }
}