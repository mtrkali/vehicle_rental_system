import path from "path";
import dotenv from "dotenv";


dotenv.config({path: path.join(process.cwd(),".env")})

const config = {
    connection_str: process.env.CONNECTION_STR,
    jwtSecret: process.env
}

export default config;
