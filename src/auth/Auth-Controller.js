import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../user/User.Model.js";
import { sendOTPEmail } from "../services/sendEmail.js";
import crypto from "crypto"

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:'lax',
};



//*create access token
function createAccessToken(user) {
return jwt.sign(
{
    userId:user._id,
    username:user.username,
    role:user.role
}
,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY
,
{
    expiresIn : "15m"
}
)
}

//*create refresh token 
function createRefreshToken(user){
return jwt.sign(
{
    userId:user._id,
}
,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY
,
{
    expiresIn:"7d"
}
)   
}

//*register user
export const registerUser = async(req,res)=>{
    try {
        const {name,username,password,email} = req.body;

        if(!name||!username||!password||!email){
            return res.status(400).json({
                success:false,
                message:"all fields are required (name,username,password,email)"
            })
        }

        const isExist = await UserModel.findOne({
            $or : [{email:email},{username:username}]
        })

        if(isExist){
            const isEmailExist = isExist.email === email; 
            return res.status(409).json({
                success:false,
                message: isEmailExist ? "email is already registered!" : "username is already taken!"
            })
        }

        const otpCode = crypto.randomInt(100000,999999).toString();
        const otpExpires = Date.now() + 10*60*1000;


        const hashedOTP = await bcrypt.hash(otpCode,10);


        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await UserModel.create({
        name:name,
        username:username,
        password:hashedPassword,
        email:email,
        otpCode:hashedOTP,
        otpExpires:otpExpires
        })

        try{
            await sendOTPEmail(newUser.email,otpCode);
            console.log(`OTP sent to ${newUser.email}`);
            
        }catch(emailErr){
            console.log("failed to send email:",emailErr);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email."
            });

        }

    return res.status(201).json({
        success:true,
        message:"user registerd successfully!"
    })

    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"
                })
    }
}

export const verifyOTP = async(req,res)=>{
    try {
   const {email,otp}=req.body;

const user = await UserModel.findOne({email});
    
if(!user){
    return res.status(404).json({
        success:false,
        message:"user not found!"
    })
}
    
if(user.isVerified){
    return res.status(400).json({
        success:false,
        message:"user already verified!"
    })
}


const isOTPMatch = await bcrypt.compare(otp,user.otpCode);

if(!user.otpCode||!isOTPMatch){
    return res.status(400).json({
        success:false,
        message:"wrong otp!"
    })
}

if(Date.now() > user.otpExpires){
    return res.status(400).json({
        success:false,
        message:"OTP is expired! create new one."
    })
}

user.isVerified = true;
user.otpCode = undefined;
user.otpExpires = undefined;
await user.save();


res.status(200).json({
    success:true, 
    message:"user verified successfully!" 
})


}
catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"
                }) 
}
}



//*login user
export const loginUser = async(req,res)=>{
    try {
    const {username,password} = req.body;

    if(!username||!password){
                return res.status(400).json({
                success:false,
                message:"all fields are required (username,password)"
            })
    }
    const user = await UserModel.findOne({username});
    if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found!"
            })
    }
    if(user.isVerified === false){
            return res.status(403).json({
                success:false,
                message:"user is not verified yet!"
            })
    }

    const isPasswordMatch =  await bcrypt.compare(password,user.password);

    if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"wrong password!"
            })
    }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);


        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie("refreshToken",refreshToken,{
            ...COOKIE_OPTIONS , maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success:true,
            message:"logged in successfully!",
            accessToken
        })


    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"
                })
    }
}


//*change password
export const changePassword = async(req,res)=>{
    try {
    const userId = req.userInfo.userId;
    const {oldPassword,newPassword} = req.body;
        
    if(!oldPassword||!newPassword){
        return res.status(400).json({
            success:false,
            message:"old password and new password is required!"
        })
    }

    const user = await UserModel.findById(userId);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found!"
        })
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
    
    if(!isPasswordMatch){
        return res.status(400).json({
            success:false,
            message:"Wrong password! try again."
        })
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);

    await UserModel.findByIdAndUpdate(
        userId,
        {password:hashedPassword}
    )


        return res.status(200).json({
            success:true,
            message:"Password is changed successfully!"
        })



    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"
        })
    }
}



//*logout user
export const logoutUser= async(req,res)=>{
    try {   
        const token = req.cookies?.refreshToken; //make the token undifiend without cATCH

        if(token){
            await UserModel.updateOne(
                {refreshTokens:token},
                {$pull : {refreshTokens:token}}
            )
        }
        res.clearCookie("refreshToken",COOKIE_OPTIONS)

       return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });

    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"
                })
    }
}



//*refresh token handler
export const refreshTokenHandler = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "refresh token is required!"
            });
        }

        let decodedToken;
        let isExpired = false;

        try {
            decodedToken = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                isExpired = true;
                decodedToken = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, { ignoreExpiration: true });
            } else if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token."
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "internal server error!"
                });
            }
        }

        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).json({
                message: "Invalid token payload structure."
            });
        }

        const user = await UserModel.findById(decodedToken.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User session not found."
            });
        }

        const tokenExists = user.refreshTokens.includes(token);

        if (isExpired) {
            if (tokenExists) {
                user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
                await user.save();
            }
            res.clearCookie("refreshToken", COOKIE_OPTIONS);
            return res.status(401).json({
                success: false,
                message: "Refresh token expired."
            });
        }

        if (!tokenExists) {
            user.refreshTokens = [];
            await user.save();
            res.clearCookie("refreshToken", COOKIE_OPTIONS);
            return res.status(403).json({
                success: false,
                message: "Security violation detected. All active sessions invalidated."
            });
        }

        const newAccessToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);
        const MAX_SESSIONS = 5;

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: decodedToken.userId,
                refreshTokens: token,
            },
            [
                {
                    $set: {
                        refreshTokens: {
                            $slice: [
                                {
                                    $concatArrays: [
                                        {
                                            $filter: {
                                                input: "$refreshTokens",
                                                cond: { $ne: ["$$this", token] }
                                            }
                                        },
                                        [newRefreshToken]
                                    ]
                                },
                                -MAX_SESSIONS
                            ]
                        }
                    }
                }
            ],
            { new: true }
        );

        if (!updatedUser) {
            res.clearCookie("refreshToken", COOKIE_OPTIONS);
            return res.status(403).json({
                success: false,
                message: "Refresh token is no longer valid.",
            });
        }

        res.cookie("refreshToken", newRefreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success: false,
            message: "internal server error!"
        });
    }
};

export const resendOTP = async(req,res)=>{
    try {
        const {email} = req.body;

        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found!"
            })
        }


        if(user.isVerified){
            return res.status(404).json({
                success:false,
                message:"user already verified!"
            })
        }

        const otpCode = crypto.randomInt(100000,999999).toString();
        const otpExpires = Date.now() + 10*60*1000;

        const hashedOTP = await bcrypt.hash(otpCode,10);

        user.otpCode = hashedOTP;
        user.otpExpires = otpExpires;

        await user.save();
        
        try{
            await sendOTPEmail(user.email,otpCode);
            console.log(`OTP sent to ${user.email}`);
            
        }catch(emailErr){
            console.log("failed to send email:",emailErr);
            return res.status(500).json({
                success: false,
                 message: "Failed to send OTP email."
             });

        }


    return res.status(200).json({
      status: 'success',
      message: 'A new OTP has been sent successfully to your email.',
    });
    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success:false,
            message:"internal server error!"
                }) 
    }
}