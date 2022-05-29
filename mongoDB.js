const mongoose = require('mongoose');
// Auth in mongoDB
const db_link = "mongodb+srv://auth:Wb8bKLxpnIfa8dyX@cluster0.vglqf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(db_link)
    .then(()=>{
        console.log("db connected");
    }).catch((err)=>{
        console.log(err);
    })


// database stracture
const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    authToken:{
        type: String
    }
});

userSchema.methods.createAuthToken = function(){
    const temp = "abcd";
    this.authToken = temp;
    return temp;
}
userSchema.methods.deleteAuthToekn = function(){
    this.authToken = undefined;
}



userSchema.methods.resetPasswordHandler = function(password){
    this.password = password;
    this.resetToken = undefined;
}

// userSchema.pre('save', async function(){
//     let salt = await bcrypt.genSalt();
//     let hashedPassword = await bcrypt.hash(this.password,salt);
//     this.password = hashedPassword;
// })




const userDataBase = mongoose.model("userModal", userSchema);
module.exports = { userDataBase };
