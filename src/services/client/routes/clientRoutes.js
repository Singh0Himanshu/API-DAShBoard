import express from "express";
import authenticate from '../../../shared/middleware/authenticate.js';
import clientDependencies from "../Dependencies/dependencies.js";

const router  = express.Router();

// Destructure the clientController from the dependencies
const { clientController } = clientDependencies.controller

//Apply middleware to all the routes.
router.use(authenticate);

//onboard new Client
router.post("/admin/clients/onboard", (req,res,next) => clientController.createClient(req,res,next));

//onboard client user
router.post("/admin/clients/:clientId/users", (req,res,next) => clientController.createClientUser(req,res,next));

//create api key
router.post("/admin/clients/:clientId/apikey", (req,res,next)=> clientController.createApiKey(req,res,next));

export default router
