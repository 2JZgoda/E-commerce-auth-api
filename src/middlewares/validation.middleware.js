export const validate = (schema)=>{
    return (req,res,next)=>{
        const inputData = {
        body: req.body,
        params: req.params,
        cookies: req.cookies,
        file: req.file,
                };

        const {error,value} = schema.validate(inputData,{
            abortEarly:false,
            stripUnknown:true,
        })

        if(error){
            const errorMessages = error.details.map((detail)=>detail.message);
            return res.status(400).json({
                success:false,
                message:`Validation Error: ${errorMessages}`
            })
        }

    if (value.body) {req.body = value.body};
    if (value.params) {req.params = value.params};
    if (value.cookies) {req.cookies = value.cookies};
    if(value.file) {req.file = value.file};

        next();
    };
};