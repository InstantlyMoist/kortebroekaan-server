let express = require('express');
let router = express.Router();

router.use("/weatherdata", require("./weatherdata.js"));

module.exports = router;