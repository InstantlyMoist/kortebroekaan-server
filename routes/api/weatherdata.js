let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
    /*
        This request should consist of the following things:
        Location (long, atd)
        ... ?
    */
    res.status(200).json({
        temperature: 20,
        unit: 'celcius',
        humidity: 80,
        rainChance: 10,
        message: 'Stay home, blijf thuis!',
        time: Date.now()
    });
});

module.exports = router;