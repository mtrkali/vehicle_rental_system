import { pool } from "../../config/db";

const createVehicle = async(payload:Record<string,unknown>) =>{
    const {vehicles_name ,type ,registration_number ,daily_rent_price ,availability_status} = payload
    const query = `INSERT INTO vehicles(vehicles_name,type,registration_number,daily_rent_price,availability_status)VALUES($1,$2,$3,$4,$5) RETURNING *`
    const values:any[] = [vehicles_name ,type ,registration_number ,daily_rent_price ,availability_status];
    const result = await pool.query(query, values);
    return result;
}

const getAllVehicles = async() =>{
    const query = `SELECT * FROM vehicles`
    const result = await pool.query(query)
    return result;
}

const getSingleVehicle = async(id: string) =>{
    const query = `SELECT * FROM vehicles WHERE id=$1`
    const result = await pool.query(query, [id]);
    return result;
}


const updateVehicle = async(id: string, payload: Record<string, unknown>) =>{
    const keys = Object.keys(payload);
    if(keys.length === 0 ){
        throw new Error('No data provided for upate')
    }
    const values = Object.values(payload);
    const fields = keys.map((key, index) => `${key}=$${index+1}`).join(", ")
    const query = `UPDATE vehicles SET ${fields} WHERE id=$${keys.length+1} RETURNING *`

    const result = await pool.query(query,[...values,id])
    return result;
}

const deleteVehicles = async(id: string) =>{
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[id])
    if(vehicle.rowCount === 0){
        throw new Error('vehicle_id not exists')
    }
    const vehicle_booking = await pool.query(`SELECT status FROM bookings WHERE vehicle_id=$1 AND status='active'`,[id])
    if(vehicle_booking.rowCount === 0){
        return await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id])
    }
    throw new Error('vehicle has active booking')
}



export const vehicleService = {
    createVehicle, getAllVehicles, getSingleVehicle, updateVehicle, deleteVehicles,
}