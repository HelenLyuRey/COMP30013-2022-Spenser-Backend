require("dotenv").config();
const mongoose = require("mongoose");

//connect to mongodb
CONNECTION_STRING = "mongodb+srv://<username>:<password>@clusterspenser.3ykoy.mongodb.net/test"
MONGO_URL = CONNECTION_STRING.replace("<username>", process.env.MONGO_USERNAME).replace("<password>", process.env.MONGO_PASSWORD)

mongoose.connect(MONGO_URL || "mongodb://localhost", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	dbName: "Spenser-db",
});
db = mongoose.connection;

db.on("error", (err) => {
	console.error(err);
	process.exit(1);
});

db.once("open", async () => {
	console.log("Mongo connection started on " + db.host + ":" + db.port);
});
