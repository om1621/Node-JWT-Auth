const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        validate: [isEmail, "Please enter valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minlength: [6, "minimum valid length for password is 6"]
    }
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const isEqual = await bcrypt.compare(password, user.password);

        if (isEqual) {
            return user;
        }

        throw "incorrect password"
    }

    throw "incorrect email"

}

const User = mongoose.model('user', userSchema);

module.exports = User;