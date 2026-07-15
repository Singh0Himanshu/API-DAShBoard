import config from "../../../shared/config/index.js";
import { APPLICATION_ROLES } from "../../../shared/constant/roles.js";
import { AuthService } from "../service/authService.js";
import ResponseFormatter from "../../../shared/utils/responseFormatter.js"
import logger from "../../../shared/config/logger.js";
import { loggers } from "winston";

export class AuthController{
    constructor(authService){
        if(!authService){
            throw new Error("authService not found");
        }
        this.authService = authService;   
    }

    async onboardSuperAdmin(req,res,next){
        try {
            const {username ,email,password} = req.body;

            const superAdminData = {
                username, email, password, role : APPLICATION_ROLES.SUPER_ADMIN
            }

            const {token,user} =await this.authService.onboardSuperAdmin(superAdminData);

            res.cookie("authToken",token,{
                httpOnly: config.cookie.httpOnly,
                // secure: config.cookie.secure,
                // secure:false,
                expireIn: config.cookie.expiresIn
            })
            logger.info(user)
            res.status(201).json(ResponseFormatter.success(user, "Super Admin onboarded Successfully", 201));
        } catch (error) {
            logger.error("Super Admin Onboard failed.",)
            next(error)
        }
    }

    async register(req,res,next){
        try {
            const {username,email,password, role} = req.body;

            const userData = {
            username,email,password, role: role || APPLICATION_ROLES.CLIENT_VIEWER
            }

            const { token, user} = await this.authService.register(userData);
            console.log("This is Token for Admin",token)
            console.log("This is user info", user);
            res.cookie("authToken",token,{
                httpOnly: config.cookie.httpOnly,
                // secure: config.cookie.secure,
                expireIn: config.cookie.expiresIn
            })
            res.status(201).json(ResponseFormatter.success(user, "User registered Successfully", 201));
        } catch (error) {
            next(error)
        }
    }

    async login(req,res,next){
        try {
            const {username, password} = req.body;

            const {token,user} = await this.authService.login(username,password);


            // res.cookie("authToken", token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            //     maxAge: config.cookie.expiresIn,
            // });
            const isHttps = process.env.USE_HTTPS === "true";

            res.cookie("authToken", token, {
                httpOnly: true,
                secure: isHttps,
                sameSite: isHttps ? "none" : "lax",
                maxAge: config.cookie.expiresIn,
            });

            res.status(200).json(ResponseFormatter.success(user,"user logedIn successfully", 200))
        } catch (error) {
            next(error)
        }
    }

    async getProfile(req,res,next){
        try {
            const userId = req.user.userId;

            const user = await this.authService.getProfile(userId);
            res.status(200).json(ResponseFormatter.success(user, "User profile fetched successfully",200));
        } catch (error) {
            next(error)
        }
    }

    async logoutUser(req,res,next){
        try {
            res.clearCookie("authToken");

            return res.status(200).json(ResponseFormatter.success("","User loggedout successfully",200));
        } catch (error) {
            next(error)
        }
    }
}