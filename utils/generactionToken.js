import jwt from 'jsonwebtoken'
import UserToken from '../Module/UserToken.js'

export const generateTokens =async(user)=>{
  try {
    const payload = { _id: user._id,roles:user.roles }
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      {expiresIn:'30d'}
    )
    const userToken = await UserToken.findOne({ userId: user._id})
    if (userToken) await userToken.remove();
    await new UserToken({ userId: user._id, token: refreshToken }).save()
    return Promise.resolve({refreshToken })
  } catch (err) {
    return Promise.reject(err)
  }
}