import bcrypt from "bcryptjs";
import { pool } from "../../config/db"



const getAllUser = async() =>{
    const result = await pool.query(`
        SELECT * FROM users `)
    return result;
}


const updateUser = async(id: string, payload: Record<string, unknown>)=>{
    const fields: string[] = [];
    const values: any[] = [];

    let index = 1

    if(payload.name){
        fields.push(`name=$${index++}`);
        values.push(payload.name)
    }
    if(payload.email){
        fields.push(`email=$${index++}`);
        values.push(payload.email)
    }
    if(payload.phone){
        fields.push(`phone=$${index++}`);
        values.push(payload.phone)
    }
    if(payload.role){
        fields.push(`role=$${index++}`);
        values.push(payload.role)
    }

    if(payload.password){
        const hashPassword = await bcrypt.hash(payload.password as string, 10);
        fields.push(`password=$${index++}`)
        values.push(hashPassword);
    }

    if(fields.length === 0){
        throw new Error('No fields to update')
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id=$${index} RETURNING *`
    values.push(id);
    const result = await pool.query(query, values);
    return result;
}

const deleteUser = async(id: string) =>{
    const user = await pool.query(`SELECT * FROM users WHERE id=$1`,[id])
    if(user.rowCount === 0){
        throw new Error('user_id not exist')
    }
    const user_bookings = await pool.query(`SELECT status FROM bookings WHERE customer_id=$1 AND status='active'`,[id])
    if(user_bookings.rowCount === 0){
        return await pool.query(`DELETE FROM users WHERE id=$1`,[id])
    }
    throw new Error('users bookings exist')
}

export const userService = {
     getAllUser, updateUser, deleteUser 
}