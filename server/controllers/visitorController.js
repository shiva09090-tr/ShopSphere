const Visitor = require("../models/Visitor");

// =====================================================
// RECORD VISITOR - ENTRY POINT
// =====================================================

const recordVisitor = async (req, res) => {
    try {
        const {
            visitorId,
            userId,
            name,
            email
        } = req.body;

        // Visitor ID required
        if (!visitorId) {
            return res.status(400).json({
                success: false,
                message: "Visitor ID is required"
            });
        }

        // Find existing visitor
        let visitor = await Visitor.findOne({
            visitorId
        });

        // =================================================
        // NEW VISITOR
        // =================================================

        if (!visitor) {
            visitor = await Visitor.create({
                visitorId,
                userId: userId || null,
                name: name || "Guest",
                email: email || "",
                firstVisit: new Date(),
                lastVisit: new Date(),
                totalVisits: 1
            });

            return res.status(201).json({
                success: true,
                isNew: true,
                message: "New visitor recorded",
                data: visitor
            });
        }

        // =================================================
        // EXISTING VISITOR
        // =================================================

        visitor.lastVisit = new Date();

        // Increase visit count
        visitor.totalVisits =
            (visitor.totalVisits || 0) + 1;

        // If user information is available,
        // update visitor information
        if (userId) {
            visitor.userId = userId;
        }

        if (name) {
            visitor.name = name;
        }

        if (email) {
            visitor.email = email;
        }

        await visitor.save();

        return res.status(200).json({
            success: true,
            isNew: false,
            message: "Returning visitor",
            data: visitor
        });

    } catch (error) {
        console.error(
            "Visitor Entry Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// VISITOR STATISTICS
// =====================================================

const getVisitorStats = async (req, res) => {
    try {

        // Total unique visitors
        const totalVisitors =
            await Visitor.countDocuments();

        // =================================================
        // TODAY
        // =================================================

        const todayStart = new Date();

        todayStart.setHours(
            0,
            0,
            0,
            0
        );

        const tomorrowStart =
            new Date(todayStart);

        tomorrowStart.setDate(
            tomorrowStart.getDate() + 1
        );

        const todayVisitors =
            await Visitor.countDocuments({
                firstVisit: {
                    $gte: todayStart,
                    $lt: tomorrowStart
                }
            });

        // =================================================
        // LAST 7 DAYS
        // =================================================

        const sevenDaysAgo =
            new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        const last7Days =
            await Visitor.countDocuments({
                firstVisit: {
                    $gte: sevenDaysAgo
                }
            });

        // =================================================
        // LAST 30 DAYS
        // =================================================

        const thirtyDaysAgo =
            new Date();

        thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 30
        );

        const last30Days =
            await Visitor.countDocuments({
                firstVisit: {
                    $gte: thirtyDaysAgo
                }
            });

        return res.status(200).json({
            success: true,
            totalVisitors,
            todayVisitors,
            last7Days,
            last30Days
        });

    } catch (error) {

        console.error(
            "Visitor Stats Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// RECENT VISITORS
// =====================================================

const getRecentVisitors = async (req, res) => {
    try {

        const visitors =
            await Visitor.find()
                .sort({
                    firstVisit: -1
                })
                .limit(100)
                .select(
                    "visitorId userId name email firstVisit lastVisit totalVisits createdAt"
                );

        return res.status(200).json({
            success: true,
            count: visitors.length,
            data: visitors
        });

    } catch (error) {

        console.error(
            "Recent Visitors Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    recordVisitor,
    getVisitorStats,
    getRecentVisitors
};