import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

 const router = Router();

 router.post('/',auth("customer", "admin"), bookingController.createBooking);
 router.get('/',auth("customer", "admin"), bookingController.getAllBookings);
 router.put('/:bookingId',auth("customer", "admin"), bookingController.updateBookings)
 
 export const bookingRoute = router; 