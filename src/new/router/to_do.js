const router=require('express').Router()
const ctrl=require('../controller/to_do')
const validation=require('../model/common')
const common = require("../lib/common");


router.post('/create',validation.To_Do_validation,common.verifyToken,ctrl.create)
router.post('/list',ctrl.list)
router.post('/info',common.verifyToken,ctrl.info)
router.put('/update/:id',validation.To_Do_validation,common.verifyToken,ctrl.update)
router.delete('/delete/:id',common.verifyToken,ctrl.delete)



module.exports=router
