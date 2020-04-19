let express = require("express");
let bodyparser = require("body-parser");
let port = process.env.PORT || 3001;
//let weatherhandler = require("./weather-handler.js");

// App initialization
let app = express();
app.use(bodyparser.json());
app.use("/", require("./routes/routes.js"));

app.listen(port, () => console.log(`kortebroekaan-server is now running on http://localhost:${port}`));

