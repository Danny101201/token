import mongoose from 'mongoose';
export const connectDb = async () => {
  const conn = await mongoose.connect(process.env.DBURL)
  mongoose.connection.on('connected',()=>{
    console.log('Connected to Db successfully to server ' );
  })
  mongoose.connection.on('error', (err)=>{
    console.log('Error while connecting to database' + err );
  })
  mongoose.connection.on('disconnected',()=>{
    console.log('Error while connecting disconnected' );
  })
  console.log('Connected successfully to server ' + conn.connection.host);
}