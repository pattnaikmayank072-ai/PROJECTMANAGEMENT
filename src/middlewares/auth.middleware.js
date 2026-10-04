import {User} from '../models/user.model.js';
import {ApiError} from '../utils/api-error.js';
import {asyncHandler} from '../utils/async-handler.js';
import jwt from "jasonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {

const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer","")

if(!token){
    throw new ApiError(401,"Unauthorized request")
}

try{
jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
await User.findById(decodedToken?._id).select("password -refreshToken -emailVerificationToken -emailVerificationExpiry",);

if(!user){
    throw new ApiError(401,"Invalid access token");
}
req.user = user
next()

}catch (error){
    throw new ApiError(401,"Invalid access token");

}

});