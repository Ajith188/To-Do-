const jwt = require('jsonwebtoken');
const model = require('../model/user')
const config = require('../../../config.json')

async function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.send({ status: 0, mssg: "Token is missing or invalid", data: null });
    }
    const bearerToken = token.slice(7);
    try {
        const decoded = jwt.verify(bearerToken, config.JwtSecretKey);
        // console.log(decoded)
        const user = await model.user.findOne({ _id: decoded.userid });
        // console.log(user)
        if (!user) {
            return res.send({ status: 0, mssg: "User not found", data: null });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.send({ status: 0, mssg: "Invalid token", data: null });
    }
}


module.exports = {
    verifyToken
}