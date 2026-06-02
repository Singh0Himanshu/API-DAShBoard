import jwt from 'jsonwebtoken';
import AppError from '../../../shared/utils/AppError.js';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/config/logger.js';
import { use } from 'react';
import bcrypt from 'bcryptjs';
import { APPLICATION_ROLES } from '../../../shared/constant/roles.js';

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

    async comparePassword(userEnteredpassword, hashedPassword){
        return await bcrypt.compare(userEnteredpassword,hashedPassword)
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

    async register(userData){
        try {
            const existingUser = await this.UserRepository.findByUsername(userData.username);
            if(existingUser){
                throw new AppError("User already exists", 401)
            }

            const existingEmail = await this.UserRepository.findByEmail(userData.email);
            if(existingEmail){
                throw new AppError("User already exists", 401)
            }

            const user = await this.UserRepository.create(userData);
            console.log("user Created for register",user)
            const token = this.generateToken(userData)

             logger.info("Super Admin onboarded successfully",{
                username: user.username
            })

            return {
                user: this.formatUserForResponse(user),
                token
            }
        } catch (error) {
            logger.error("Error while registering user", error)
            throw error;
        }
    }

    async login(username,password){
        try {
            const user = await this.UserRepository.findByUsername(username);

            if(!user){
                throw new AppError("invalid credential",401);
            }

            if(!user.isActive){
                throw new AppError("Account is DeActivated",403)    ;
            }

            const isPasswordValid = await this.comparePassword(password, user.password)

            if(!isPasswordValid){
                throw new AppError("invalid credential",401);
            }

            const token = await this.generateToken(user)
            logger.info("user logged successfully",{username: user.username})
             return {
                user: this.formatUserForResponse(user),
                token
             }
        } catch (error) {
            logger.error("Error in login service", error)
            throw error
        }
    }

    async getProfile(userId){
        try {
            const userdata = await this.UserRepository.findById(userId);
            if(!userdata){
                throw new AppError("user not found", 404)
            }
            
            return this.formatUserForResponse(userdata);
        } catch (error) {
            throw error
        }
    }

    async checkSuperAdminPermissions(userId) {
        try {
            const user = await this.UserRepository.findById(userId);
            if (!user) {
                throw new AppError("User not found", 404);
            }

            return user.role === APPLICATION_ROLES.SUPER_ADMIN
        } catch (error) {
            console.log("checkSuperAdminPermissions error", error)
        }
    }
}