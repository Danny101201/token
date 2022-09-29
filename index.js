import { config } from 'dotenv';
import express from 'express';
import { connectDb } from './db/connectDB.js';
import authRoutes from './routes/auth.js';
const app = express();
config()
const port = process.env.PORT ||8080

app.use(express())
app.use(express.json())
app.use('/api', authRoutes)
app.listen(port,()=>{
  connectDb()
  console.log(`server run on port ${port}`)
})