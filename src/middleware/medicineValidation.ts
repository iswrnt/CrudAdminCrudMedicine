import { NextFunction, Request, Response } from "express";
import Joi, { required } from "joi";
import path from "path";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";

/**create a rule/schema for add new medicine */
const createSchema = Joi.object({
    name: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    price: Joi.number().min(1).required(),
    exp_date: Joi.date().required(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").required(),
})

const createValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = createSchema.validate(req.body)
    if (validate.error) {
        /**delete current uploaded file */
        let fileName: string = req.file?.filename || ``
        let pathFile = path.join(ROOT_DIRECTORY, "public", "medicine-photo", fileName)
        /**check is file exists */
        let fileExsists = fs.existsSync(pathFile)
        /**apakah ada file yang akan dihapus */

        if (fileExsists && fileName !== ``) {
            /**delete file */
            fs.unlinkSync(pathFile)
        }
        return res.status(400)
            .json({
                message: validate
                    .error
                    .details
                    .map(it => it.message)
                    .join()
            })
    }
    next()
}

/**create a rule/scheme for update medicine */
const updateSchema = Joi.object({
    name: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    price: Joi.number().min(1).optional(),
    exp_date: Joi.date().optional(),
    type: Joi.string().valid("Syrup", "Tablet", "Powder").optional(),
})

const updateValidation = (req: Request, res: Response, next: NextFunction) => {
    const validate = updateSchema.validate(req.body)
    if (validate.error) {
         /**delete current uploaded file */
         let fileName: string = req.file?.filename || ``
         let pathFile = path.join(ROOT_DIRECTORY, "public", "medicine-photo", fileName)
         /**check is file exists */
         let fileExsists = fs.existsSync(pathFile)
         /**apakah ada file yang akan dihapus */
 
         if (fileExsists && fileName !== ``) {
             /**delete file */
             fs.unlinkSync(pathFile)
         }
        return res.status(400)
            .json({
                message: validate
                    .error
                    .details
                    .map(it => it.message)
                    .join()
            })
    }
    next()
}

export { createValidation, updateValidation }