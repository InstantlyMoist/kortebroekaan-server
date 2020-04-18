let express = require('express');
let router = express.Router();

router.use("/api", require("./api/api.js"));

router.get('/', (req, res) => {
    res.sendFile("./index.html", {root: "."});
});

module.exports = router;