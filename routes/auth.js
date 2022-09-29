import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import User from "../Module/User.js";
import UserToken from "../Module/UserToken.js";
import { signUpBodyValidation, loginBodyValidation, refreshTokenValidation } from '../utils/validationSchema.js';
import { generateTokens } from '../utils/generactionToken.js';
import { verifyRefshToken } from '../utils/verifyRefshToken.js'

import roleCheck from '../middlware/roleCheck.js'
import auth from '../middlware/auth.js'


const router = Router()

// signUp
router.post("/signUp",async(req,res)=>{
  try{
    const { error } = signUpBodyValidation(req.body)
    if (error){
      return res.status(400).json({ error: true, message: error.details[0].message})
    }
    const user = await User.findOne({ email: req.body.email})
    if (user){{
      return res.status(400).json({ error: true, message: "email has been signup" })
    }}
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).json({ error: false, message: "Account created successfully" })
  }catch(e){
    console.log(e)
    res.status(500).json({error:true,message:"Internal Server Error"})
  }
})
router.get('/user',async (req,res)=>{
  const users = await User.find().select('-password');
  if(!users)return res.status(400).json({error:true,message:'not has users'})
  return res.json({ users})
})

// login && get refresh token
router.post('/login',async (req,res)=>{
  try {
    const { error } = loginBodyValidation(req.body)
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message })
    }
    const user = await User.findOne({ email: req.body.email })
    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!user || !verifiedPassword) {
      return res.status(401).json({ error: true, message: "Invalidate email or password" })
    }
    const { refreshToken }=await generateTokens(user)
    res.status(200).json({
      error:false,
      refreshToken,
      message:'Logged in successfully'
    })
   } catch (e) {

    res.status(500).json({ error: true, message: "Internal Server Error" })
  }
})
// get access token
router.post('/member/accessToken',async(req,res)=>{
  try{
    const { error } = refreshTokenValidation(req.body)
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message })
    }
    const { tokenDetails } = await verifyRefshToken(req.body.refreshtoken)
    const payload = { _id: tokenDetails._id, roles: tokenDetails.roles }
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: '30d' }
    )
    res.status(200).json({
      error: false,
      accessToken,
      message: 'accessToken created successfully'
    })
  }catch(err){
    console.log(err)
    res.status(500).json({ error: true, message: "Internal Server Error" })
  }
})
// logout
router.delete('/logout',async(req,res)=>{
  try{
    const { error } = refreshTokenValidation(req.body)
    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message })
    }
    const userToken = await UserToken.findOne({ token: req.body.refreshtoken })
    await userToken.remove();

    return res.status(200).json({ error: false,message:'logged out successfully'})
  }catch(e){
    res.status(500).json({ error: true, message: "Internal Server Error" })
  }
})

router.get("/member/details", auth,roleCheck(['admin']),async (req, res) => {
  res.status(200).json({ message: "user authenticated." });
});
export default router