const model=require('../model/to_do')
const moment=require('moment')
const { mongo, default: mongoose, Aggregate } = require('mongoose')
const { validationResult } = require("express-validator")




exports.create=async function (req,res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ status: 0, msg: "Validation errors", data: null });
        }
        if (req.body.completed === "true") {
            return res.send({ status: 0, msg: "'completed' cannot be true when creating a new task", data: null });
        }

        req.body.completed = req.body.completed === "false" ? false : false;
        req.body.userId =req.user._id.toString() 
        req.body.date = moment(new Date()).toISOString().slice(0, 10);

        const result=await model.ToDo.create(req.body)
        if(result){
        res.send({ status: 1, msg: "Successfully created", data: result });
        }else{
        res.send({ status: 0, msg: " Failed to created", data: [] });
        }
    } catch (error) {
        res.send({ status: 0, msg: "Internal server error", data: error.message });
    }
    
}



exports.list = async function (req, res) {
    try {
        let { page, limit } = req.body;
        const sortField = req.body.sortField || "Datetime" ;
        const sortOrder = req.body.sortOrder || -1;       /////1 is asc or -1 is dsc 
        let query = {};
        if (req.body.StartDate || req.body.EndDate) {
            query['Datetime'] = {};
            req.body.StartDate && (query['Datetime']['$gte'] = new Date(`${req.body.StartDate}T00:00:00Z`));
            req.body.EndDate && (query['Datetime']['$lte'] = new Date(`${req.body.EndDate}T23:59:59Z`));
        }
        if (req.body.filter) {
            query['$and'] = req.body.filter.map(filter => {
                return Object.entries(filter).reduce((acc, [field, value]) => {
                    const isNumeric = !isNaN(value) || /^\d+$/.test(value);
                    acc[field] = isNumeric ? parseInt(value, 10) : { $regex: new RegExp(value, 'i') };
                    return acc;
                }, {});
            });
        }
        const sortObj = {};
        sortObj[sortField] =  sortOrder ;
        const total = await model.ToDo.countDocuments(query);
        const totalCount = await model.ToDo.countDocuments();
        const Page = Math.ceil(limit);
        const currentPage = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 10;

        const skip = (currentPage - 1) * parseInt(limit);
        const result = await model.ToDo.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));
        if (result != 0) {
            res.send({ status: 1, msg: '', totalCount, filterData: total, limit: Page, currentPage, result });
        } else {
            res.send({ status: 0, msg: '', data: [] });
        }
    } catch (error) {
        res.send(
            { status: 0, msg: 'Internal server error', data: [] });
    }
}



exports.info = async function (req, res) {
    try {
        if(req.user.role == "User"){
            if (req.body.userId) {
                const validUserId = req.body.userId ? mongoose.Types.ObjectId.isValid(req.body.userId) ? new mongoose.Types.ObjectId(req.body.userId) : null : req.user._id;
                const result = await model.ToDo.findById(validUserId)
                if (result) {
                    res.send({ status: 1, msg: "", data: result })
                } else {
                    res.send({ status: 0, msg: "Data Not Found", data: [] })
                }
            } else {
                res.send({ status: 0, msg: "Invalid field", data: [] })
            }
        }else{
            res.send({ status: 0, msg: "Invalid Role", data: [] })
        }
        
    } catch (error) {
        res.send({ status: 0, msg: "", data: error.message })
    }

}

exports.update = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ status: 0, msg: "Validation errors", data: null });
        }
        if (req.user.role == "User") {
            if (req.params.id) {
                const validUserId = req.params.id ? mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : null : req.user._id;
                const result = await model.ToDo.findByIdAndUpdate(validUserId, req.body, { new: true })
                if (result) {
                    res.send({ status: 1, msg: "Update Successfully", data: result })
                } else {
                    res.send({ status: 0, msg: "Data Not Found", data: [] })
                }
            } else {
                res.send({ status: 0, msg: "Invalid field", data: [] })
            }
        } else {
            res.send({ status: 0, msg: "Invalid Role", data: [] })
        }
    } catch (error) {
        res.send({ status: 0, msg: "", data: error.message })
    }
}



exports.delete = async function (req, res) {
    try {
        if (req.user.role == "User") {
            if (req.params.id) {
                const validUserId = req.params.id ? mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : null : req.user._id;
                const result = await model.ToDo.findByIdAndDelete(validUserId)
                if (result) {
                    res.send({ status: 1, msg: "Deleted Successfully" })
                } else {
                    res.send({ status: 0, msg: "Data Not Found", data: [] })
                }
            } else {
                res.send({ status: 0, msg: "Invalid field", data: [] })
            }
        } else {
            res.send({ status: 0, msg: "Invalid Role", data: [] })
        }

    } catch (error) {
        res.send({ status: 0, msg: "", data: error.message })
    }
}



