const Portfolio = require('../models/portfolio');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { ApiResponse } = require('../helpers');
const fs = require('fs');

//list portfolio 
exports.list = (req, res) => {
    const options = {
        page: req.query.page ? req.query.page : 1,
        limit: req.query.limit ? req.query.limit : 10,
      };

      const portfolioAggregate = Portfolio.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $project: {
            "category.createdBy": 0,
            "category.createdAt": 0,
            "category.updatedAt": 0,
          },
        },
        { $unwind: "$category" },
      ]).sort({ createdAt: -1 });

      Portfolio.aggregatePaginate(portfolioAggregate, options, (err, portfolio) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!portfolio) {
            return res.json(ApiResponse({}, "No portfolio found", false))
        }
        return res.json(ApiResponse(portfolio))
    })
}

//get portfolio by category
exports.getByCategory = (req, res) => {
    Portfolio.find({ category: req.params.category}).populate('category').exec((err, portfolio) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!portfolio) {
            return res.json(ApiResponse({}, "No portfolio found", false))
        }
        return res.json(ApiResponse(portfolio,"",true))
    })
}


//add portfolio
exports.add = (req, res) => {
    req.body.createdBy = req.user._id

    console.log(req.body);

    const portfolio = new Portfolio(req.body)
    portfolio.save((err, portfolio) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        return res.json(ApiResponse(portfolio))
    })
}

//get portfolio by id
exports.get = (req, res) => {
    Portfolio.findById(req.params.id, (err, portfolio) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!portfolio) {
            return res.json(ApiResponse({}, "Portfolio not found", false))
        }
        return res.json(ApiResponse(portfolio))
    })
}

//update portfolio
exports.update = (req, res) => {
    if (req.body.image) {
        Portfolio.findById(req.params.id, (err, portfolio) => {
          if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
          }
          if (portfolio.image) {
            fs.unlinkSync(`./uploads/${portfolio.image}`);
          }
        })
      }

      
    Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, portfolio) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!portfolio) {
            return res.json(ApiResponse({}, "Portfolio not found", false))
        }
        return res.json(ApiResponse(portfolio))
    })
}

//remove portfolio
exports.remove = (req, res) => {
    Portfolio.findByIdAndRemove(req.params.id, (err, portfolio) => {
        if (err) {
            return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
        }
        if (!portfolio) {
            return res.json(ApiResponse({}, "Portfolio not found", false))
        }
            if (portfolio.image) {
              fs.unlinkSync(`./uploads/${portfolio.image}`);
            }
        return res.json(ApiResponse(portfolio))
    })
}





