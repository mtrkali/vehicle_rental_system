import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";


const auth = (...roles:string[]) =>{
    return async(req: Request, res: Response, next: NextFunction)=>{
        const bearerToken = req.headers.authorization;
        const token = bearerToken?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'unAthorized user'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await pool.query(`SELECT * FROM users WHERE email=$1`,[decoded.email]);

        if(user.rows.length === 0){
            return res.status(401).json({
                success: false,
                message: 'user not found'
            })
        }

        req.user = decoded;

        if(roles.length && !roles.includes(decoded.role)){
            return res.status(403).json({
                success: false,
                message: 'forbidden access'
            })
        }

        next();
    }
}

export default auth;