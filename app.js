const express = require("express");
var path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
const cors = require("cors");
const axios = require("axios");
const port = process.env.PORT || 2000;

const flash = require("connect-flash");

// const session = require("express-session");
const { json } = require("body-parser");
const mainRounter = require("./routes/main");

require("./models/index.js");
require("./models");

const corsOptions = {
	origin: "*",
	// origin: "http://localhost:3000",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(cors());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, DELETE, OPTIONS"
	);
	next();
});

app.use(express.json()); // replaces body-parser
app.use(express.urlencoded({ extended: true })); // to access the body of a POST request as using JSON like syntax
app.use(express.static("public")); // define where static assets live

axios.create({
	// baseURL: `https://aos-infolounge-back.herokuapp.com/`,
	baseURL : `http://localhost:2000`,
});

app.options("*", cors());
app.use("", mainRounter);

// setup a session store signing the contents using the secret key
// app.use(
// 	session({
// 		secret: process.env.PASSPORT_KEY,
// 		resave: true,
// 		saveUninitialized: true,
// 	})
// );

app.use(flash());
app.use(json());
app.use(express.static(path.join(__dirname, "public")));


app.all("*", (req, res) => {
	console.log("Page Not Found!");
	res.status(404).json({ code: -1, msg: "Page Not Found!" });
});


app.listen(port, async () => {
	console.log(`Spenser Server is listening to port ${port}...`);
});

module.exports = app;
