const jwt = require('jsonwebtoken');

async function authArtist(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized User" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role != "artist") {
            return res.status(403).json({ message: "You must be an artist to create an album" })
        }

        req.user = decoded;

        next()

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized User" })
    }
}

async function authUser(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized User" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;
        if(decoded.role !== "user") {
            return res.status(403).json({ message: "You don't have access" })
        }
        next()
    } catch(err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized User" })
    }
}

module.exports = { authArtist, authUser };