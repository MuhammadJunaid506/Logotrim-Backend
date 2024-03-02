const express = require("express")
const { signin , signup } = require("../controllers/auth")
const router = express.Router()
const { signinValidator } = require("../validators/auth")

router.post("/signin",signinValidator, signin)
router.post("/signup", signup)

module.exports = router