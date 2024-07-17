import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'disabled', 'deleted'],
        default: 'active'
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password') || this.isNew){
        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next();
        } catch (error) {
            next(error)
        }
    }
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema);
