const jwt = require("jsonwebtoken")
const { Manager, Facilitator } = require("../models")

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    let user
    if (decoded.role === "manager") {
      user = await Manager.findByPk(decoded.id)
    } else if (decoded.role === "facilitator") {
      user = await Facilitator.findByPk(decoded.id)
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      })
    }

    req.user = user
    req.userRole = decoded.role
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      })
    }
    next()
  }
}

module.exports = { authenticate, authorize }
