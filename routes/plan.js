const express = require("express")
const { list, listByCategory, create, update, remove,planById,applyDiscount } = require("../controllers/plan")
const { authenticatedRoute } = require("../middlewares/auth")
const {planValidator} = require("../validators/plan")
const router = express.Router()



router.get("/", list)
router.get("/category/:id", listByCategory)
router.get("/:id", planById)
router.post("/", authenticatedRoute,planValidator('create'), create)
router.put("/:id", authenticatedRoute, update)
router.delete("/:id", authenticatedRoute, remove)
router.post('/discount',authenticatedRoute,applyDiscount)

module.exports = router