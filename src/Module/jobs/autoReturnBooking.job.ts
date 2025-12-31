import { pool } from "../../config/db"

const autoReturnBooking = async() =>{
    const expiredBookings = await pool.query(`SELECT id, vehicle_id FROM bookings WHERE status='active' AND rent_end_date < CURRENT_DATE`)

    const allExipiredBooking = expiredBookings.rows;
    for(const  booking of allExipiredBooking){
        await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`,[booking.id])
        await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id])
    }
}

export default autoReturnBooking;