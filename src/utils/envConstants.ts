import dotenv from 'dotenv';


dotenv.config();
export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || '';
export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || '';