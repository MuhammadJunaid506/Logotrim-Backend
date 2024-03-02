const Order = require("../models/order")
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse } = require("../helpers")


//add order
exports.checkout = (req, res) => {
    //create a unique number order id from request body
    

    const order = new Order(req.body)
    order.save((err, orderObj) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }

        console.log("orderObj",orderObj)
        

        return res.json(ApiResponse(orderObj))
    })
}


//get all orders
exports.getOrders = (req, res) => {
    Order.find({}).populate("plan").exec((err, orders) => {
    // Order.find({}, (err, orders) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!orders) {
            return res.json(ApiResponse({}, "No orders found", false))
        }
        return res.json(ApiResponse(orders))
    })
}

//get order by id
exports.getOrderById = (req, res) => {
    Order.findById(req.params.id, (err, order) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!order) {
            return res.json(ApiResponse({}, "Order not found", false))
        }
        return res.json(ApiResponse(order))
    })
}


//update order
exports.updateOrder = (req, res) => {
    console.log("req.body",req.body)

    // json parse the requirements object
    const requirements = JSON.parse(req.body.requirements)
    console.log("requirements",requirements)
    req.body.requirements = requirements

    Order.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, order) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!order) {
            return res.json(ApiResponse({}, "Order not found", false))
        }
        return res.json(ApiResponse(order,"Order updated successfully"))
    })
}

//delete Order 
exports.deleteOrder = (req, res) => {
    Order.findByIdAndDelete(req.params.id, (err, order) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!order) {
            return res.json(ApiResponse({}, "Order not found", false))
        }
        return res.json(ApiResponse(order, "Order deleted successfully"))
    })
}