const express = require("express");
const router = express.Router();

router.get("/", (req, res, next)=> {
    res.send({ express: "Welcome to Trek Tribe"});
});

module.exports = router;