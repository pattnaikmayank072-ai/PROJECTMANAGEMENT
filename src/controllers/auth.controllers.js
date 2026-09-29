import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import {sendEmail} from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});
    return{accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access token", );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken
    user.emailVerificationTokenExpiry = tokenExpiry
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email:user.email,
        subject:"please verify your email",
        mailgenContent:emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a  user")
    }
    return res
    .staus(201)
    .json(
       new ApiResponse(
        200,
        {user: createdUser},
        "User registered successfully and verification email has been sent on your email" 
       ) 
    )
});

const login = asyncHndler(async(req,res)=>{
 const {email,password,username}=  req.body

 if(!username || !email){
  throw new ApiError(400, "Username or email is required")
 }
const user = await User.findOne({email});
if(!user){
  throw new ApiError(400,"User does not exists ");
}
const isPasswordVlid = user.isPasswordCorrect(password);
});

if(!isPasswordVlid){
    throw new ApiError(400,"Invalid credentials");
}
await generateAccessAndRefreshTokens(user._id)

export{registerUser};
