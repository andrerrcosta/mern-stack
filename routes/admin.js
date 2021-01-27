const express = require('express');
const router = express.Router();
const middleware = require("../middlewares/session");



router.get("/dashboard", middleware, async (req, res) => {

    try {
        const hires = await HireModel.find({});
        const demos = await AppDemoModel.find({});

        res.status(200).send({ hires: hires, demos: demos });

    } catch (e) {
        res.status(500).send({ error: e })
    }

});


module.exports = router;