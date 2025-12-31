import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";


 const createBooking = async(req: Request, res: Response)=>{
    try {
        const user = req.user;
        const result = await bookingService.createBooking(user!.id, req.body);
        return res.status(201).json({
            success: true,
            message: 'bookings created successfully',
            data: result.rows
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    } 
 }

 const getAllBookings = async(req: Request, res: Response) =>{
    try {
        const user = req.user!
        const result = await bookingService.getAllBookings(user);
        return res.status(200).json({
            success: true,
            message: 'Bookings got successfully',
            data: result,
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
 }

 const updateBookings = async(req: Request, res: Response)=>{
    try {
        const booking_id = req.params.bookingId;
        const action = req.body.action;
        const user = req.user;
        const result = await bookingService.updateBookings(booking_id as string, action, user as JwtPayload);
        return res.status(201).json({
            success: true,
            message: 'booking update success!!',
            data: result
        })
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
 }

 export const bookingController = {
    createBooking, getAllBookings, updateBookings, 
 }