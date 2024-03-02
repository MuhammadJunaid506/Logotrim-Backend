const express = require("express")
const router = express.Router()
const { authenticatedRoute } = require("../middlewares/auth")
const {payment} = require("../middlewares/payment")
const{checkout,getOrders,getOrderById,deleteOrder,updateOrder} = require("../controllers/order");
const {orderValidator} = require("../validators/order")
const plan = require("../models/plan");
const {uploadFile} = require("../middlewares/upload");
const { ApiResponse } = require("../helpers");
const {sendCheckoutEmail} = require("../middlewares/mail");


router.post("/checkout",orderValidator('create'),payment,
// sendCheckoutEmail,
checkout)
router.get("/",authenticatedRoute, getOrders)
router.get("/:id", getOrderById)
router.delete("/:id", authenticatedRoute, deleteOrder)
router.put("/:id", authenticatedRoute,orderValidator('update'), updateOrder)
router.put("/requirement/:id", uploadFile,updateOrder)

module.exports = router