require("dotenv").config();
let express = require("express"),
  app = express(),
  jwt = require("jsonwebtoken"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  cors = require("cors"),
  User = require("./database/user");

let jwtOption = {};
jwtOption.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOption.secretOrKey = process.env.SECRET;

let Strategy = new JwtStrategy(jwtOption, (payload, done) => {
  let email = payload.email;
  let name = payload.name;
  User.find(email)
    .then((admin) => {
      if (admin.name == name) {
        done(null, admin);
      }
    })
    .catch((err) => done(err, null));
});

let userRoute = require("./routes/user")(express, jwt, passport, bodyParser);

let path = require("path");

passport.use(Strategy);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./files")));

app.use(cors());
app.use("/api/secretR", userRoute);

app.listen(process.env.PORT, (_) => {
  console.log(`Server is running at ${process.env.PORT}`);
});
