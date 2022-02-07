
var mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { timeStamp } = require('console');


const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true, 
        maxlength: 32,
        trim: true
    },
    lastName:{
        type: String,
        required: false, 
        maxlength: 32,
        trim: true
    },
    email:{
        type: String, 
        trim: true,
        required: true,
        unique: true
    },
    userinfo:{
        type: String, 
        trim: true
    },

    encry_password:{
        type: String, 
        required: true
    },

    salt: String,

    role: {
        type: Number,
        default: 0
    },

    purchases: {
        type: Array, 
        default: 0
    }   
},{timestamps: true}); 

//creating virtual (or virtual fields)
//this will create a virtual field which will store the secure password
userSchema.virtual("password")
    .set(function(password){
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })

//encrypting our passwords 
userSchema.method = {
    
    //this method converts normal password to encrypted password
    //uses npm package crypto
    securePassword: function(plainpassword){
        if(!password){
            return "";
        }
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch (err){
            return "";
        }
    },

    //check wether the user is authenticated or not 
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
        /* 
            if this is going to match that securePassword matches
            the encry_password that means the user is created the
            password and his password is already been secured and is 
            in the database and this proves that the user is authenticated 
        */
    }
}



mongoose.export =  mongoose.model("User", userSchema);

