import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
//*clinet side
    name:{
    type:String,
    required:[true,"User name is required"],
    trim:true,
    minlength:2,
    match: [/^[a-zA-Z\u0600-\u06FF\s]+$/, "Name must contain English or Arabic letters and spaces only"],
    maxlength:59
},


    username:{
    unique:true,
    type:String,
    required:[true,"username is required"],
    match: [/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, underscores, and dots with no spaces"],
    trim:true,
    lowercase:true,
    minlength:[1,"Too short username"],
    maxlength:[59,"Too long username"]
},


email:{
    type:String,
    required: [true, 'Email address is required'],
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    unique:true,
    lowercase:true,
    trim:true,
},

password:{
    type:String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
},


//*post register work
profilePic:{
    type:String,
    default:null,
    trim: true
    },

//*server side
role:{
    type:String,
    enum:["customer","admin"],
    default:"customer"
},

isVerified:{
    type:Boolean,
    default:false
    }
,
otpCode:{
    type:String,
    default:null
},
otpExpires:{
    type:Date,
    default:null,
}
,
refreshTokens:[
        {
        type:String,
        trim:true
        }
    ]
},
{
    timestamps:true
}

);

export const UserModel = mongoose.model("User",UserSchema);