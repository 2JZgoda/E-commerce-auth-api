import nodemailer from "nodemailer"

console.log("FROM_EMAIL:", process.env.FROM_EMAIL);

export const transporter = nodemailer.createTransport({
  
host:process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT),
secure:false,
auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS,
},
pool:true,
maxConnections:5,
maxMessages:100
})

  
export const sendOTPEmail = async(toEmail,otp)=>{
    const mailOptions={
        from:process.env.FROM_EMAIL,
        to: toEmail,
        subject:"OTP",
        
        html:`
        <h2>OTP</h2>
        <p>USE THIS OTP TO COMPLETE YOUR ACCOUNT</p>
        <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        ">
        ${otp}
        </div>
        `,
        text:`Your OTP is ${otp}`
    };

    
    
transporter.verify((error) => {
    if (error) {
      console.error("SMTP Connection Failed:", error.message);
    } else {
      console.log("SMTP Server is ready to send emails");
    }
  });

return transporter.sendMail(mailOptions);
}