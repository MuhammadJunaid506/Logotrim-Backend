const Plan = require("../models/plan")
const { errorHandler } = require("../helpers/dbErrorHandler")
const { ApiResponse } = require("../helpers")
const mongoose = require("mongoose")

exports.list = (req, res) => {
    // const limit = req.query.limit ? req.query.limit : 10; 
    const discountAggregate =[
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {discountValue: {$multiply:[{$divide:["$discount",100]},"$price"]}}
        },
        {
            $addFields: {discountedPrice: {$subtract:["$price","$discountValue"]}}
        }
    ];


    try {
        console.log(req.query)
        Plan.aggregate(discountAggregate)
        .exec((err, data) => {
            if (err) {
                return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
            }
            if (!data) {
                return res.json(ApiResponse({}, "No plans found", false))
            }
            return res.json(ApiResponse(data))
        })  
    } catch (error) {
        return res.json(ApiResponse({},"Error While Fetching Data",false))
    }
   

}

exports.listByCategory = (req, res) => {
    const discountAggregate = [
        {
          $match: {
            category: new mongoose.Types.ObjectId(req.params.id) ,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            discountValue: {
              $multiply: [{ $divide: ["$discount", 100] }, "$price"],
            },
          },
        },
        {
          $addFields: {
            discountedPrice: { $subtract: ["$price", "$discountValue"] },
          },
        },
      ];
  
  
  
      try {
          Plan.aggregate(discountAggregate)
          .exec((err, data) => {
                if (err) {
                    return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
                }
                if (!data) {
                    return res.json(ApiResponse({}, "No plans found", false))
                }
                return res.json(ApiResponse(data))
            }) 
    } catch (error) {
        return res.json(ApiResponse({},"Error While Fetching Data",false))
    }
    
}

exports.planById = (req, res) => {
    const discountAggregate = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id) ,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            discountValue: {
              $multiply: [{ $divide: ["$discount", 100] }, "$price"],
            },
          },
        },
        {
          $addFields: {
            discountedPrice: { $subtract: ["$price", "$discountValue"] },
          },
        },
      ];
  
    try {
     Plan.aggregate(discountAggregate)
        .exec((err, data) => {
                if (err) {
                    return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
                }
                if (!data) {
                    return res.json(ApiResponse({}, "No plans found", false))
                }
                return res.json(ApiResponse(data[0]))
            }) 
    } catch (error) {
        return res.json(ApiResponse({},"Error While Fetching Data",false))
    }
    
}

exports.create = (req, res) => {
    const plan = new Plan(req.body)
    plan.save((err, data) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        return res.json(ApiResponse(data))
    })
}

exports.update = (req, res) => {

  

    Plan.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, data) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!data) {
            return res.json(ApiResponse({}, "Plan not found", false))
        }
        return res.json(ApiResponse(data))
    })
}

exports.remove = (req, res) => {
    Plan.findByIdAndDelete(req.params.id, (err, data) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!data) {
            return res.json(ApiResponse({}, "Plan not found", false))
        }
        return res.json(ApiResponse(data))
    })
}

// apply discount to all plans
exports.applyDiscount = (req, res) => {
    Plan.updateMany({}, { $set: { discount: req.body.discount } }, (err, data) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!data) {
            return res.json(ApiResponse({}, "No plans found", false))
        }
        return res.json(ApiResponse(data))
    })
}




