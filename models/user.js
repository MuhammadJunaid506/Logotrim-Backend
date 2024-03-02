const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v1

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        displayPicture: {
            type: String,
            default:
                "https://therminic2018.eu/wp-content/uploads/2018/07/dummy-avatar-300x300.jpg",
        },
    },
    { timestamps: true }
);

userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuid()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            const salt = bcrypt.genSaltSync(10)
            console.log(bcrypt.hashSync(password, salt))
            return bcrypt.hashSync(password, salt)
        }
        catch (err) {
            console.log("err",err)
            return ""
        }
    },
    authenticate: function (plainText) {
        // console.log("this.encryptPassword(plainText)",this.encryptPassword(plainText))
        // console.log("this.hashed_password",this.hashed_password)
        return bcrypt.compareSync(plainText, this.hashed_password);
        // return this.encryptPassword(plainText) === this.hashed_password      
    }
}

module.exports = mongoose.model("user", userSchema);