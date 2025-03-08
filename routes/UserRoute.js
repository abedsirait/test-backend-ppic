import express from "express";
import {
    Login,
    Register,
    Logout,
    getUser
} from "../controller/Users.js";
import {
    getallProductionresults, 
    getProductionbyId,
    uploadProductionresults,
    updateProductionresults,
    deleteProductionresults,
    getallIntakeresults,
    getIntakebyId,
    uploadIntakeresults,
    updateIntakeresults,
    deleteIntakeresults,
    exportIntakeresults,
    exportProductionresults,
    getEditRequestsIntake,
    requestEditIntake,
    resolveEditRequestIntake,
    requestEditProduction,
    getEditRequestsProduction,
    resolveEditRequestProduction
} from "../controller/UserController.js";
import { verifyToken } from "../controller/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";
import {checkRole} from "../middleware/RoleMiddleware.js";


const router = express.Router();

//LOGIN USERS
router.post("/register", Register);
router.post("/login", Login);
router.get("/user", verifyToken,getUser);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

// Production results Endpoint
router.get("/production", verifyToken, checkRole(["production","admin"]), getallProductionresults);
router.get("/production/:id",verifyToken, checkRole(["production","admin"]), getProductionbyId);
router.post("/uploadproduction", verifyToken,checkRole(["production"]), uploadProductionresults);
router.patch("/production/:id",verifyToken,checkRole(["production","admin"]), updateProductionresults);
router.delete("/production/:id",verifyToken,checkRole(["production","admin"]), deleteProductionresults);
router.post("/production/request-edit", verifyToken, checkRole(["production", "admin"]), requestEditProduction);


// Intake results Endpoint
router.get("/intake", verifyToken, checkRole(["intake","admin"]), getallIntakeresults);
router.get("/intake/:id", verifyToken, checkRole(["intake", "admin"]), getIntakebyId);
router.post("/uploadintake", verifyToken, checkRole(["intake"]), uploadIntakeresults);
router.patch("/intake/:id", verifyToken, checkRole(["intake", "admin"]), updateIntakeresults);
router.delete("/intake/:id", verifyToken, checkRole(["intake", "admin"]), deleteIntakeresults);
router.post("/intake/request-edit", verifyToken, checkRole(["intake", "admin"]), requestEditIntake);

//Admin results Endpoint
router.get("/export/intake", exportIntakeresults);
router.get("/export/production", exportProductionresults);
router.get("/admin/intake/request-edit", verifyToken, checkRole(["admin"]), getEditRequestsIntake);
router.patch("/admin/intake/request-edit/:id", verifyToken, checkRole(["admin"]), resolveEditRequestIntake);
router.get("/admin/production/request-edit", verifyToken, checkRole(["admin"]), getEditRequestsProduction);
router.patch("/admin/production/request-edit/:id", verifyToken, checkRole(["admin"]), resolveEditRequestProduction);


export default router;