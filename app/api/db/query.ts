import { Pool } from "pg";

const pool = new Pool({
    user: process.env['DATABASE_USER'],
    host: process.env['DATABASE_HOST'],
    database: process.env['DATABASE_NAME'],
    password: process.env['DATABASE_PASSWORD'],
    port: parseInt(process.env['DATABASE_PORT']??'X'), 
  });

const query = async (queryString : string) => {
    const client =  await pool.connect();
    const res = await client.query(queryString);
    client.release()
    return res
 }

export default query;