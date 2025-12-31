import { Request, Response } from "express"
import { authService } from "./auth.service"
import { userService } from "../users/user.service";

const logInUser = async(req: Request, res: Response) =>{
    try {
        const {email, password} = req.body;
        const result = await authService.logInUser(email, password)
        return res.status(200).json({
            success: true,
            message: 'login success full',
            data: result
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.createUser(req.body);
        return res.status(201).json({
            success: true,
            message: 'user created',
            data: result.rows[0]
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const authController = {
    logInUser, createUser,
}