import express, { Request, Response } from "express"
import { initDB } from "./config/db"
import { userRoute } from "./Module/users/user.routes"
import { authRoute } from "./Module/auth/auth.routes"
import { vehicleRoute } from "./Module/vehicles/vehicles.route"
import { bookingRoute } from "./Module/bookings/booking.routes"
import cron from 'node-cron';
import autoReturnBooking from "./Module/jobs/autoReturnBooking.job"
const app = express()
app.use(express.json())


//initialize db
initDB()

cron.schedule('0 0 * * *',async()=>{
    await autoReturnBooking();
})

app.use('/api/v1/users',userRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/vehicles',vehicleRoute)
app.use('/api/v1/bookings', bookingRoute);

app.get('/', (req: Request, res: Response)=>{
    res.send('rental system is cocking')
})

app.listen(5000,() =>{
    console.log('our server running on port 5000');
})