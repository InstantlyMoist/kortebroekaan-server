let express = require('express');
let router = express.Router();

router.use("/api", require("./api/api.js"));

module.exports = router;