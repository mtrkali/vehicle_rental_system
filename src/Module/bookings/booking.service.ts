import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db"


const createBooking = async (customerId: number, payload: Record<string, unknown>) => {
    const { vehicle_id, rent_start_date, rent_end_date } = payload;
    console.log(vehicle_id, typeof(vehicle_id));
    const target_vehicle = await pool.query(`SELECT daily_rent_price, availability_status FROM vehicles WHERE id=$1`, [vehicle_id]);

    if (target_vehicle.rowCount === 0) {
        throw new Error('vehicle not found')
    }
    const vehicle = target_vehicle.rows[0];

    if (vehicle.availability_status === "booked") {
        throw new Error('vehicle is not available')
    }

    const start_date = new Date(rent_start_date as string);
    const end_date = new Date(rent_end_date as string);

    if (start_date >= end_date) {
        throw new Error('end date must be after start date')
    }

    const duraiton = ((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 34));
    const totalPrice = Number(duraiton * Number(vehicle.daily_rent_price)).toFixed(2);


    const query = `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,'active') RETURNING *`
    const bookingResult = await pool.query(query, [customerId, vehicle_id, rent_start_date, rent_end_date, totalPrice])

    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id])

    return bookingResult;
}

const getAllBookings = async (user: JwtPayload) => { 
    if (user.role === 'customer') {
        const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`,[user.id])
        return result.rows;
    }else if(user.role === 'admin'){
        const result = await pool.query(`SELECT * FROM bookings`)
        return result.rows;
    }else{
        throw new Error('un accessable role')
    }
   
}

// const updateBookings = async (booking_id: string, action: string, user: JwtPayload) => {
//     const target_booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [booking_id]);
//     if (target_booking.rowCount === 0) {
//         throw new Error('booking not found');
//     }

//     const booking = target_booking.rows[0]

//     const today = new Date();
//     const start_date = new Date(booking.rent_start_date);

//     if (user.role === "customer") {
//         if (action !== "cancelled") {
//             throw new Error('Forbidden')
//         }

//         if (today >= booking.start_date) {
//             throw new Error('cannot cancel after start date')
//         }

//         if (booking.customer_id !== user.id) {
//             throw new Error('Forbidden')
//         }

//         await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [booking.id])
//         await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id])
//     }
//     if (user.role === "admin") {
//         if (action !== "returned") {
//             throw new Error('Invalid action')
//         }
//         await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [booking.id])
//         await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id])
//     }
//     const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [booking.id])
//     return result.rows[0];

// }

const updateBookings = async(bookingId:string, action:string, user:JwtPayload)=>{
    const target_booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId])
    if(target_booking.rowCount === 0){
        throw new Error('booking not found')
    }

    const booking = target_booking.rows[0];
    const today = new Date();
    const start_date = new Date(booking.rent_start_date);

    if(user.role === 'customer'){
        if(booking.customer_id !== user.id){
            throw new Error('forbidden')
        }
        if(action !== 'cancelled'){
            throw new Error('Invalid operation')
        }
        if(today >= start_date){
            throw new Error('cannot cancel after start date');
        }
        await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`,[booking.id])
        await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`,[booking.vehicle_id])
    }

    if(user.role === "admin"){
        if(action !== "returned"){
            throw new Error('Invaled operation')
        }
        await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`,[bookingId]);
        await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`,[booking.vehicle_id]);
    }

    const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`,[bookingId])
    return result.rows[0];
}

export const bookingService = {
    createBooking, getAllBookings, updateBookings,
}