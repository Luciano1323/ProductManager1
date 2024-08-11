require('dotenv').config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy; // Asegúrate de importar esto
const session = require('express-session');
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const swaggerSetup = require('./config/swagger');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const User = require('./models/userModel');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  logger.info("Connected to MongoDB");
}).catch((error) => {
  logger.error("Error connecting to MongoDB", error);
});

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Estrategia de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
        logger.error("Error in GitHubStrategy", error); // Captura detallada del error
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

// Rutas
app.get("/auth/github", passport.authenticate("github"));

app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/products");
});

// Manejo de errores
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

swaggerSetup(app);

server.listen(3000, () => {
  logger.info(`Server is listening at http://localhost:3000`);
});
