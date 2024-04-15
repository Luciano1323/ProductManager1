const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("./models");
const ProductManager = require("./productManager");
const CartManager = require("./cartManager");
const { mongoose } = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const productManager = new ProductManager();
const cartManager = new CartManager();

app.use(express.json());
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");
app.use(express.static(__dirname + "/public"));

// Configurar express-session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Configurar Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Configure Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Ruta para iniciar sesión con Passport Local Strategy
app.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/products");
});

// Ruta para iniciar sesión con Passport GitHub Strategy
app.get("/auth/github", passport.authenticate("github"));

app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/products");
});

// Ruta para el login
app.get("/login", (req, res) => {
  res.render("login");
});

// Ruta para el logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
});

// Ruta para la vista de productos (requiere autenticación)
app.get("/products", isAuthenticated, async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products", { products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ruta para la vista de perfil (requiere autenticación)
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Middleware para verificar la sesión del usuario
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

// Middleware para verificar el rol del usuario
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.redirect("/profile");
  }
};

// Otros endpoints y configuraciones...

server.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
