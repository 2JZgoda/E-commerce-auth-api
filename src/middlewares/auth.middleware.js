import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next)=>{
    
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(" ")[1];

    if(!token){
            return res.status(401).json({
            success : false,
            message : 'access denied. no token provided. please login to continue'
        }) 
    }

    try{
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET_KEY
        );
        req.userInfo = decodedToken;
        next();

        
    }catch(error){
            return res.status(401).json({
            success : false,
            message : 'access denied. please login to continue'
        }) 
    }
}