import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicle(req.body);
        return res.status(200).json({
            success: true,
            message: 'vehicle created successfully!!',
            data: result.rows[0]
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles()
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'data not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'vehicle came successfully!!',
            data: result.rows
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSingleVehicle = async(req: Request, res:Response) =>{
    try {
        const id = req.params.vehicleId
        console.log(id, typeof(id));
        const result = await vehicleService.getSingleVehicle(id as string);
        if(result.rows.length === 0){
         res.status(404).json({
            success: false,
            message: 'vehicle not found'
         })
        }else{
         res.status(200).json({
            success: true,
            message: 'vehicle got successfully',
            data: result.rows[0]
         })
        }

    } catch (error: any) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

const updateVehicle = async(req: Request, res: Response) =>{
    try {
        const result = await vehicleService.updateVehicle(req.params.vehicleId as string, req.body)
        return res.status(200).json({
            success: true,
            message: 'vehicle updated successfully',
            data: result.rows,
        });
    } catch (error: any) {
        return res.status(500).json({
            success:false,
            message: error.message
        });
    };
}

const deleteVehicles = async(req: Request, res: Response) =>{
    try {
        const result = await vehicleService.deleteVehicles(req.params.vehicleId as string);
        return res.status(200).json({
            success: true,
            message: 'user successfully deleted!!',
            data: result.rows[0]
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const vehicleController = {
    createVehicle, getAllVehicles, getSingleVehicle, updateVehicle, deleteVehicles,
}