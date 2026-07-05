require("dotenv").config();
const express = require("express");
const fs = require("fs");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ================= DISCORD LOGIN =================
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ["identify", "guilds"]
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ================= DB =================
function getDB() {
    return JSON.parse(fs.readFileSync(process.env.BOT_DATABASE));
}

// ================= ROLE SYSTEM =================
function getRole(userId) {
    const db = getDB();

    const citizen = db.citizens.find(c => c[0] === userId);
    if (!citizen) return "NONE";

    return citizen[1].role || "OFFICER";
}

function checkRole(role, allowed) {
    return allowed.includes(role);
}

// middleware
function auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

// ================= ROUTES =================
app.get("/", auth, (req, res) => {
    res.render("dashboard", {
        user: req.user,
        role: getRole(req.user.id)
    });
});

// ===== CITIZENS SEARCH =====
app.get("/api/citizens/search", auth, (req, res) => {
    const q = (req.query.q || "").toLowerCase();
    const db = getDB();

    const results = db.citizens.filter(([id, c]) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.opNumber.toLowerCase().includes(q) ||
        c.robloxNick.toLowerCase().includes(q) ||
        id.includes(q)
    );

    res.json(results);
});

// ================= LOGIN =================
app.get("/login", passport.authenticate("discord"));

app.get("/auth/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    (req, res) => res.redirect("/")
);

app.get("/logout", (req, res) => {
    req.logout(() => {});
    res.redirect("/login");
});

// ================= SERVER =================
app.listen(process.env.PORT, () => {
    console.log("MDT RUNNING ON PORT", process.env.PORT);
});
