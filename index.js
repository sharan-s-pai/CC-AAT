const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require('connect-flash');

const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);

const auth = require("./routes/auth");
const user = require('./routes/user');


const User = require("./models/user")

const app = express();

const MONGO_URI = 'mongodb+srv://'+process.env.username+':'+process.env.password+'@'+'cc-aat-01.y12fiin.mongodb.net/?retryWrites=true&w=majority';

app.use(flash());
app.set("views", "views");
app.set("view engine", "ejs");
mongoose.set('strictQuery', false);
app.use(bodyParser.urlencoded({ extended: false }));

const store = new SessionStore({
  uri: MONGO_URI,
  collection: 'sessions'
});

app.use(
  session({
    secret: "What is god", // Signing the Hash value which secretly stores our session id in cookie. It will be encoded in a hash value. Keep it long. More the security.

    resave: false, // Session will not be saved for every request. If this is set to false.But will save if there is change in session.
    saveUninitialized: false, // Basically won't allow session to be saved for every request.
    store: store, // Points to the store.
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next)=>{
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        // In Async part of the code if we throw an error. Our code will be stuck in a loop. So its necessary for us to send the error as a parameter in next(err) so that express can direct it to error handling middleware.
        errorHandler(err, next);
      });
  } else {
    next();
  }
});

app.use((req,res,next)=>{
  res.locals.logged=req.session.logged;
  next();
})

app.use(auth);
app.use('/user',user);
app.get('/',(req,res,next)=>{
  return res.redirect('/login');
})
app.use('/',(req,res,next)=>{
  return res.render('404.ejs',{
    pageTitle: '404 Error'
  });
})

// app.use((req,res,next)=>{
// })

mongoose.connect(MONGO_URI)
.then(()=>{
  console.log("Server Connected to "+process.env.PORT);
  app.listen(process.env.PORT)
})
.catch((err)=>{
  console.log(err);
});