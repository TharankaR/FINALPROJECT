//should have express here cz in package says that
// (if you call it server then have to change it on package)

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const PORT = 8000;

const app = express();

app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());

app.get("/grwgrw", eew);

// app.router...can use this to organize into other folders

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
