const Visitor = require("../models/Visitor");

// ==========================================
// ENTRY POINT
// ==========================================

const recordVisitor = async (req, res) => {
    try {

        const { visitorId } = req.body;

        if (!visitorId) {
            return res.status(400).json({
                success: false,
                message: "Visitor ID is required"
            });
        }

        let visitor = await Visitor.findOne({
            visitorId
        });

        // New visitor
        if (!visitor) {

            visitor = await Visitor.create({
                visitorId,
                firstVisit: new Date(),
                lastVisit: new Date()
            });

            return res.status(201).json({
                success: true,
                isNew: true,
                message: "New visitor recorded"
            });
        }

        // Existing visitor
        visitor.lastVisit = new Date();

        await visitor.save();

        return res.status(200).json({
            success: true,
            isNew: false,
            message: "Returning visitor"
        });

    } catch (error) {

        console.error("Visitor Entry Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// VISITOR STATS
// ==========================================

const getVisitorStats = async (req, res) => {

    try {

        const totalVisitors =
            await Visitor.countDocuments();


        // Today
        const todayStart = new Date();

        todayStart.setHours(0, 0, 0, 0);

        const tomorrowStart = new Date(
            todayStart
        );

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


        // Last 7 days
        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );


        const last7Days =
            await Visitor.countDocuments({
                firstVisit: {
                    $gte: sevenDaysAgo
                }
            });


        // Last 30 days
        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 30
        );


        const last30Days =
            await Visitor.countDocuments({
                firstVisit: {
                    $gte: thirtyDaysAgo
                }
            });


        res.status(200).json({

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

        res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// ==========================================
// RECENT VISITORS
// ==========================================

const getRecentVisitors = async (req, res) => {

    try {

        const visitors =
            await Visitor.find()
                .sort({
                    firstVisit: -1
                })
                .limit(100)
                .select(
                    "visitorId firstVisit lastVisit createdAt"
                );


        res.status(200).json({

            success: true,

            count: visitors.length,

            data: visitors

        });

    } catch (error) {

        console.error(
            "Recent Visitors Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {

    recordVisitor,

    getVisitorStats,

    getRecentVisitors

};