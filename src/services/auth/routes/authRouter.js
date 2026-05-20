import express from "express";
import dependencies from "../Dependencies/dependencies.js"
import authorize from "../../../shared/middleware/authorize.js";
import authenticate from "../../../shared/middleware/authenticate.js";
import validate from "../../../shared/middleware/validate.js";
import requestLogger from "../../../shared/middleware/requestLogger.js";
import errorHandler from "../../../shared/middleware/errorHandler.js";
import { onboardSuperAdminSchema,loginSchema,registrationSchema } from "../validation/authSchema.js";
import { APPLICATION_ROLES } from "../../../shared/constant/roles.js";

const router = express.Router();
const {controller} = dependencies;
const authController = controller.authController;


router.post("/onboard-super-admin",
    requestLogger,
    validate(onboardSuperAdminSchema),
    (req, res, next) => authController.onboardSuperAdmin(req, res, next)
)

router.post("/register",
    requestLogger,
    authenticate,
    authorize([APPLICATION_ROLES.SUPER_ADMIN]),
    validate(registrationSchema),
    (req,res,next) => authController.register(req,res,next)
)



export default router;


