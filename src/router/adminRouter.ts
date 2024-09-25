import { Router } from "express";
import { authentication, createAdmin, deleteAdmin, readAdmin, updateAdmin } from "../controller/adminController";
import { authValidation, createValidation, updateValidation } from "../middleware/adminValidation";
import { uploadAdminPhoto } from "../middleware/uploadAdminPhoto";
import { verifyToken } from "../middleware/authorization";
const router = Router()

router.post(`/`, [verifyToken, uploadAdminPhoto.single(`photo`), createValidation], createAdmin)
router.get(`/`, [verifyToken], readAdmin)

//route for update medicine
router.put(`/:id`, [verifyToken, uploadAdminPhoto.single(`photo`), updateValidation], updateAdmin)
router.delete(` /:id `, [verifyToken], deleteAdmin)
router.post(`/auth`, [authValidation], authentication)
export default router;