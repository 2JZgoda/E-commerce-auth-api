import { UserModel } from "./User.Model.js";
import bcrypt from "bcrypt"




export const createUser = async(req,res)=>{
    try{
    const {name,username,password,email} = req.body
    if(!name||!username||!password||!email){
        console.log("stopped in control");
        return res.status(400).json({
            success:false,
            message:"all fields are required (name,username,password,email)"
        })
    }

    const isExist = await UserModel.findOne({
        $or :[{email},{username}]
    })
    
    if(isExist){
    const isEmailTaken = isExist.email === email;
    return res.status(409).json({
        success: false,
        message: isEmailTaken ? "Email is already registered!" : "Username is already taken!"
    });

    }


    const hashedPassword = await bcrypt.hash(password,10);

    //*instant save
    const newUser = await UserModel.create({
        name:name,
        username:username,
        password:hashedPassword,
        email:email
    })

    return res.status(201).json({
        success:true,
        message:"user added successfully!"
    })
    }
    catch(error){        
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 

        })
    }

}





export const getAllUsers = async(req,res)=>{
    try{

            const page = Math.max(1,parseInt(req.query.page,10) || 1);
                const limit  = Math.max(1,parseInt(req.query.limit,10) || 10);
                const skip = (page-1) * limit;
            
            
                const allowedSortFields = ["name", "createdAt", "updatedAt"];
            
            
                const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt"
            
                const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
            
                const totalUsers = await UserModel.countDocuments();
                const totalPages = Math.ceil(totalUsers / limit);
            
                const sortObj = {};
            
                sortObj[sortBy] = sortOrder;


        const allUsers = await UserModel.find().sort(sortObj).skip(skip).limit(limit).lean().select("-__v");
        res.status(200).json({
            success:true,
            message:"users fetched successfully!",
            data:allUsers
        })
    }
    catch(error){
        
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 

        })
    }

}



export const deleteUserById = async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found! No user was deleted."
            });
        }
        return res.status(200).json({
        success:true,
        message:"User deleted successfully!",
        data:deletedUser

    })
}
    catch(error){
        
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 

        })
    }

}




export const getUserById = async(req,res)=>{
    try{
        const {id} = req.params;
        const user = await UserModel.findOne({_id:id});
    
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            })
        }
    
        return res.status(200).json({
            success:true,
            message:"User fetched successfully",
            data:user
        })  

    }
    catch(error){
        
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 

        })
    }

}   





export const getUserByUsername = async(req,res)=>{
    try{
        const {username} = req.params;
        const user = await UserModel.findOne({username:username});
    
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!"
            })
        }
    
        return res.status(200).json({
            success:true,
            message:"User fetched successfully",
            data:user
        })

    
    }
    catch(error){
        
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 

        })
    }

}





export const updateUser = async(req,res)=>{
    try{
        const {id} = req.params;

        const {name,email,profilePic,username} = req.body;

        const updatePayload = {};
        
        if(name){
            updatePayload.name = name;
        }
        if(username){
            updatePayload.username = username;
        }
        if(email){
            updatePayload.email = email;

        }
        if(profilePic){
            updatePayload.profilePic = profilePic;
        }


        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updatePayload,
            {new:true,runValidators:true}
        )

        if (!updatedUser) {
        return res.status(404).json({
        success: false,
        message: "User not found!"
        });
    
    }


        return res.status(200).json({
            success:true,
            message:"User updated successfully!",
            id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic        
            })

}
    catch(error){
        
        return res.status(500).json({
            success:false,
            message:"Internal server error!",
            error: error.message 

        })
    }

}