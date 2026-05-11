import config from "../../../shared/config/index.js";
import { APPLICATION_ROLES } from "../../../shared/constant/roles.js";
import { AuthService } from "../service/authService.js";
import ResponseFormatter from "../../../shared/utils/responseFormatter.js"
import logger from "../../../shared/config/logger.js";

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

            res.cookie("SuperAdmin",token,{
                httpOnly: config.cookie.httpOnly,
                secure: config.cookie.secure,
                expireIn: config.cookie.expiresIn
            })
            logger.info(user)
            res.status(201).json(ResponseFormatter.success(user, "Super Admin onboarded Successfully", 201));
        } catch (error) {
            next(error)
        }
    }
}