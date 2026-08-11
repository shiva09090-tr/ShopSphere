const express = require("express");

const router = express.Router();

const {
    recordVisitor,
    getVisitorStats,
    getRecentVisitors
} = require("../controllers/visitorController");


// Entry point
router.post(
    "/entry",
    recordVisitor
);


// Statistics
router.get(
    "/stats",
    getVisitorStats
);


// Recent visitors
router.get(
    "/recent",
    getRecentVisitors
);


module.exports = router;