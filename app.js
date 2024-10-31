const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const https = require("https");

require("dotenv").config();

// Routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const newsRouter = require("./routes/news");
const contactsRouter = require("./routes/contacts");
const activitiesRouter = require("./routes/activities");
const organizationsRouter = require("./routes/organizations");
const testimoniesRouter = require("./routes/testimonies");
const categoriesRouter = require("./routes/categories");
const membersRouter = require("./routes/members")
const uploadRouter = require("./routes/uploads");
const app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/news", newsRouter);
app.use("/organizations", organizationsRouter);
app.use("/contacts", contactsRouter);
app.use("/activities", activitiesRouter);
app.use("/testimonies", testimoniesRouter);
app.use("/categories", categoriesRouter);
app.use("/members", membersRouter);
app.use("/upload", uploadRouter);

// Rutas de proxy para SuperHero API
app.get("/api/superhero/search/:character", (req, res) => {
  const character = req.params.character;
  const url = `https://superheroapi.com/api/b2db602f073241ccf79529027610df4d/search/${character}`;
  https.get(url, (apiRes) => {
    let data = "";
    apiRes.on("data", (chunk) => {
      data += chunk;
    });
    apiRes.on("end", () => {
      try {
        const parsedData = JSON.parse(data);
        return res.json(parsedData); // Asegura el fin del flujo
      } catch (error) {
        console.error("Error parsing data from SuperHero API:", error);
        return res.status(500).json({ error: "Error parsing data from SuperHero API", details: error.message });
      }
    });
  }).on("error", (error) => {
    console.error("Error fetching data from SuperHero API:", error);
    return res.status(500).json({ error: "Error fetching data from SuperHero API", details: error.message });
  });
})


app.get("/api/superhero/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`https://superheroapi.com/api/b2db602f073241ccf79529027610df4d/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from SuperHero API:", error);
    res.status(500).json({ error: "Error fetching data from SuperHero API" });
  }
});
//aca termina



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//app port listener
// Comment this block on development to do the tests
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server initialized on port ${process.env.SERVER_PORT} `);
});

module.exports = app;
