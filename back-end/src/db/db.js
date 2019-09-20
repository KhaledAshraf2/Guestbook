const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
},(err)=>{
    if(err){
        console.log("MongoDB Connection Error: ")
		console.log(err.message)
    }
    else{
        console.log("MongoDB Connected .....")
    }
})