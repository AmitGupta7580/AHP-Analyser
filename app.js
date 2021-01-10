const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const csrfMiddleware = csrf({ cookie: true });

const PORT = 3000

//Requiring Routes.
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const profileRouter = require('./routes/profile')
const hierarchyRouter = require('./routes/hierarchy')
const crthierarchyRouter = require('./routes/crthierarchy')
const datasetRouter = require('./routes/dataset')
const expertsRouter = require('./routes/experts')
const aboutRouter = require('./routes/about')

// Initializing app
const app = express();

// Setting up our view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('public'));

// Parses the body for POST, PUT, DELETE, etc.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// cookie parser and csrf middleware
app.use(cookieParser());
app.use(csrfMiddleware);

// intercept all requests and verify csrf token
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

// Telling express to use Routes
app.use('/',loginRouter);
app.use('/',homeRouter);
app.use('/',profileRouter);
app.use('/',hierarchyRouter);
app.use('/',datasetRouter);
app.use('/',crthierarchyRouter);
app.use('/',expertsRouter);
app.use('/',aboutRouter);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})