const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const logger = require("morgan");
const config = require("./config");
const restifyJwt = require("restify-jwt-community");
const mongoose = require("mongoose");
const pjson = require("../package.json");

require("dotenv").config();

console.log(`Starting server v${pjson.version}`);
console.log("Loaded configuration:", config);

const server = restify.createServer({
  name: pjson.name,
  version: pjson.version,
});

// middlewares
server.use(logger("dev"));
server.use(restify.plugins.queryParser());
server.use(
  restify.plugins.bodyParser({
    mapParams: true,
    mapFiles: true,
    keepExtensions: true,
    uploadDir: "/tmp/",
  })
);
server.pre(restify.pre.sanitizePath());

// protect routes except auth using JWT
server.use((req, res, next) => {
  restifyJwt({ secret: config.JWT_SECRET }).unless({ path: ["/api/auth"] })(
    req,
    res,
    next
  );
});

// cors
const cors = corsMiddleware({
  origins: ["*"],
});

server.pre(cors.preflight);
server.use(cors.actual);

// response delay for testing
if (config.ARTIFICIAL_DELAY) {
  server.use((req, res, next) => {
    setTimeout(() => {
      next();
    }, config.ARTIFICIAL_DELAY);
  });
}

// mongodb connection
server.listen(config.PORT, () => {
  mongoose
    .connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .catch((err) => {
      console.log("Could not connect to MongoDB", err);
      process.exit(1);
    });
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log("MongoDB error", err);
  process.exit(1);
});

db.once("open", () => {
  // setup routes
  require("./routes/auth")(server);
  require("./routes/users")(server);
  require("./routes/dirs")(server);
  require("./routes/tags")(server);
  require("./routes/documents")(server);
  console.log(`Server listening for API requests on port ${config.PORT}`);
});
