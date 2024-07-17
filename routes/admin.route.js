import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, renderLogin, loginUser, renderDashboard, logout } from "../controllers/admin.controller.js";

const router = Router();

const setNoCacheHeaders = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
};

router.route('/registerNewUser').post(verifyJWT, registerUser)
router.route('/login').get(renderLogin)
router.route('/login').post(loginUser)
router.route('/dashboard').get(verifyJWT,setNoCacheHeaders,renderDashboard)
router.route('/logout').get(verifyJWT, logout)

export default router;
