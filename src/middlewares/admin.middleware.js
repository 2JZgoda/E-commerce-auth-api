export const adminMiddleware = (req,res,next)=>{
    if(!req.userInfo||req.userInfo.role !== "admin"){
        return res.status(403).json({
            success:false,
            message:"Access denied. Admins only."
        })
    }
    next();
};