import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { log } from "console";
import path from "path";
import fs from "fs"
import { ROOT_DIRECTORY } from "../config";
import bcrpyt from "bcrypt"
import jwt  from "jsonwebtoken";



const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const findEmail = await prisma.admin
            .findFirst({ where: { email } })
        if (findEmail) {
            return res.status(400)
                .json({message: `Email has exists`})
        }

        const hashPassword = await bcrpyt.hash(password, 12)
        const admin = await prisma.admin.create({
            data: {
                username,
                email,
                password: hashPassword
            },
        });

        return res.status(201).json({
            message: `Admin created successfully`,
            data: admin,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

const readAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = req.query.search
        const admins = await prisma.admin.findMany({
            where: {
                OR: [
                    { username: { contains: search?.toString() || "" } }
                ]
            }
        });
        return res.status(200).json({
            message: `Admins retrieved successfully`,
            data: admins,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { username, email, password } = req.body;
        const findAdmin = await prisma.admin
            .findFirst({ where: { id: Number(id) } })
            if (!findAdmin) {
                return res.status(200)
                    .json({
                        message: `Admin is not found`
                    })
            }
        const admins = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                username: username? username : findAdmin.username,
                email: email? email : findAdmin.email,
                password: password? await bcrpyt.hash(password,12) : findAdmin.password,
            },
        });

        return res.status(200).json({
            message: `Admin updated successfully`,
            data: admins,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await prisma.admin.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: `Admin deleted successfully`,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

/** function for login (authentication) */
const authentication = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body

        /**check existing email */
        const findAdmin = await prisma 
        .admin.findFirst({
            where: { email }
        })

        if (!findAdmin) {
            return res.status(200)
            .json({
                message:`Email is not registered`
            })
        }

        const isMatchPassword = await bcrpyt.compare(password, findAdmin.password)

        if (!isMatchPassword) {
            return res.status(200)
            .json({
                message:`Invalid password`
            })    
        }
        
        /**prepare to generate token using JWT */
        const payload = {
            username: findAdmin.username,
            email: findAdmin.email
        }
        const signature = process.env.SECRET || ``

        const token = jwt.sign(payload, signature)

        return res.status(200)
        .json({
            logged: true,
            token,
            id: findAdmin.id,
            username: findAdmin.username,
            email: findAdmin.email
        })



    } catch (error) {
        return res.status(500)
        .json(error)
    }
}
export { 
    createAdmin, updateAdmin, 
    deleteAdmin, readAdmin,
    authentication
}