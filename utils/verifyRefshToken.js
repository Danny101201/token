import UserToken from "../Module/UserToken.js";
import jwt from 'jsonwebtoken'

export const verifyRefshToken =(refreshtoken)=>{
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY

  return new Promise(async(resolve,reject)=>{
    const doc = await UserToken.findOne({ token: refreshtoken })
    if (!doc) return reject({ error: true, message: "invalid refresh token" })
    const tokenDetails =  jwt.verify(refreshtoken, privateKey)
    if (!tokenDetails) return reject({ error: true, message: "invalid refresh token" })
    resolve({
      tokenDetails,
      errors:false,
      message:"valid refresh token"
    })
  })
}