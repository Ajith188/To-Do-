const router=require('express').Router()
const ctrl=require('../controller/user')
const validation=require('../model/common')
// const common = require("../../lib/common");


router.post('/register',validation.validation,ctrl.register)
router.post('/login',validation.login_validation,ctrl.login)


module.exports=router
