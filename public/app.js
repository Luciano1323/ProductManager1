const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("./models");
const ProductManager = require("../services/ProductManager");
const CartManager = require("../services/cartManager");
const mongoose = require("mongoose");
const session = require('express-session');
const logger = require("./utils/logger");
const swaggerSetup = require('./swagger'); // Importar configuración de Swagger

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager();
const cartManager = new CartManager();
const mockRoutes = require('./routes/mockRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(errorHandler);
app.use('/api', mockRoutes);
app.use(express.json());
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Integrar Swagger
swaggerSetup(app);

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  logger.info("Connected to MongoDB");
}).catch((error) => {
  logger.error("Error connecting to MongoDB", error);
});

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false);
      return done(null, user);
    } catch (error) {
      logger.error("Error in LocalStrategy", error);
      return done(error);
    }
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
          });
        }
        return done(null, user);
      } catch (error) {
        logger.error("Error in GitHubStrategy", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    logger.error("Error in deserializeUser", error);
    done(error);
  }
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/products");
});

app.get("/auth/github", passport.authenticate("github"));

app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/products");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error during logout", err);
    }
    res.redirect("/login");
  });
});

app.get("/products", isAuthenticated, async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products", { products });
  } catch (error) {
    logger.error("Error fetching products", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.redirect("/profile");
  }
};

// Endpoint para probar los logs
app.get('/loggerTest', (req, res) => {
  logger.debug("This is a debug message");
  logger.http("This is an http message");
  logger.info("This is an info message");
  logger.warning("This is a warning message");
  logger.error("This is an error message");
  logger.fatal("This is a fatal message");
  res.send('Check the logs for output');
});

server.listen(3000, () => {
  logger.info(`Server is listening at http://localhost:3000`);
});
