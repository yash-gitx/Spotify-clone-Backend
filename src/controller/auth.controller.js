const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {

    const { username, email, password, role = "user" } = req.body;
    const doesUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (doesUserAlreadyExist) {
        return res.status(409).json({
            message: "Username or eamil already in use"
        })
    }
    // hashing : encrypting data
    const hash = await bcrypt.hash(password, 10) // 10 -> salt; 

    const user = userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({
        _id: user.id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token);

    res.status(201).json({
        message: "User registerd",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function loginUser(req, res) {

    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.staus(401).json({ message: "Invalid username or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Loged in succesfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

async function logoutUser(req, res) {

    res.clearCookie("token")
    res.status(200).json({
        message: "User Logged Out"
    })
}
module.exports = { registerUser, loginUser, logoutUser };