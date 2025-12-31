import { Request, Response } from "express";
import { userService } from "./user.service"



const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUser();
        return res.status(200).json({
            success: true,
            message: 'got all user',
            data: result.rows
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const updateUser = async(req: Request, res: Response) =>{
    try {
        const targetUserId = req.params.userId;
        const logedInUser = req.user!;
       
        if(logedInUser.role === "customer" && logedInUser.id  != targetUserId){
            return res.status(403).json({
                success: false,
                message: 'fobidden access !!!!'
            })
        }

        if(logedInUser.role === "customer"){
            delete req.body.role;
        }
        const result = await userService.updateUser(targetUserId as string, req.body);
        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: 'user not found !!'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'user updated successfully',
            data: result.rows[0]
        })
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUser = async(req: Request, res: Response) =>{
    try {
        const result = await userService.deleteUser(req.params.userId as string);
        return res.status(200).json({
            success: true,
            message: 'user successfully deleted !!',
            data: result.rows[0]
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const userController = {
     getAllUser, updateUser, deleteUser, 
}