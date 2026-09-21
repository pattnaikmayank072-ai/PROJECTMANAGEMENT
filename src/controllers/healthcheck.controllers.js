import {ApiResponse}from"../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// const healthCheck = async(req,res,next)=>{
//     try{
//         const user = await getUserFromDB()
//          res.status(200).json(
//             new ApiResponse(200,{message:"server is running"})
//         );

//     }catch(error){
//         next(err)
       
//     }
// };
//hello this is mayank here
//pull shark step 2


const healthCheck =asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,{message:"server is running"}));
});
export {healthCheck};