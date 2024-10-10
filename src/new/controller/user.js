const { validationResult } = require("express-validator")
const userController = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const moment=require('moment')
const config=require('../../../config.json')
let fs = require('fs');
const mongoose = require('mongoose')






exports.register = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ status: 0, msg: "Validation errors", data: null });
        } else {
            const userCheck = await userController.user.findOne({
                $or: [
                    { email: req.body.email },
                    { user_name: req.body.user_name }
                ]
            });

            if (!userCheck) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                req.body.date = moment(new Date()).toISOString().slice(0, 10);
                const result = await userController.user.create(req.body);
                if(result){
                    res.send({ status: 1, msg: "Successfully registered", data: result });
                }else{
                    res.send({ status: 0, msg: "Failed to register ", data: [] })
                }
            } else {
                res.send({ status: 0, msg: "Email or username already exists", data: null });
            }
        }
    } catch (err) {
        res.send({ status: 0, msg: "Internal server error", data: err.message });
    }
};





exports.login = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ status: 0, msg: "Validation errors", data: null });
        }
        const { email, user_name, password: password } = req.body;
        if (email) {
            const user = await userController.user.findOne({ email: email });
            if (user) {
                const passwordCheck = await bcrypt.compare(password, user.password);
                if (passwordCheck) {
                    const token = jwt.sign({ userid: user._id ,role:user.role}, config.JwtSecretKey, { expiresIn: "1d" });
                    const result = await userController.user.findOneAndUpdate(
                        { email: email },
                        user,
                        { new: true }
                    )
                    if(result){
                        return res.send({ status: 1, msg: "Login Successfully", data: result,token });
                    }else{
                        return res.send({ status: 0, msg: "", data: [] });
                    }
                } else {
                    return res.send({ status: 0, msg: "Incorrect Password", data: null });
                }
            } else {
                return res.send({ status: 0, msg: "Email not found", data: null });
            }
        }

        if (email == undefined) {
            const user = await userController.user.findOne({ user_name: user_name });
            if (user) {
                const passwordCheck = await bcrypt.compare(password, user.password);
                if (passwordCheck) {
                    const token = jwt.sign({ userid: user._id ,role:user.role}, config.JwtSecretKey, { expiresIn: "1d" });
                    const resp = await userController.user.findOneAndUpdate(
                        { user_name: user_name },
                        user,
                        { new: true }
                    );
                    if(resp){
                        return res.send({ status: 1, msg: "Login Successfully", data: resp ,token});
                    }else{
                    return res.send({ status: 0, msg: "", data: []});
                    }
                } else {
                    return res.send({ status: 0, msg: "Incorrect Password", data: null });
                }
            } else {
                return res.send({ status: 0, msg: "Username not found", data: null });
            }
        }
        return res.send({ status: 0, msg: "Please provide email or username", data: null });
    } catch (err) {
        return res.send({ status: 0, msg: "Internal server error", data: err.message });
    }
};
