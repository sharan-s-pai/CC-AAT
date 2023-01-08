const bcryptjs = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  let err = req.flash("error");
  return res.render("login", {
    pageTitle: "Login Page",
    email: req.flash("email"),
    password: req.flash("password"),
    error: err,
  });
};
exports.postLogin = (req, res, next) => {
  const body = req.body;
  let userIn = null;
  User.findOne({
    email: body.email,
  }).then((user) => {
    if (!user) {
      req.flash("email", body.email);
      req.flash("password", body.password);
      req.flash("error", "userError");
      return res.redirect("/login");
    }
    //   console.log(user.password, body.password);
    return bcryptjs.compare(body.password, user.password).then((result) => {
      //   console.log(result);
      if (!result) {
        req.flash("email", body.email);
        req.flash("password", body.password);
        req.flash("error", "passwordError");
        return res.redirect("/login");
      }
      req.session.logged = true;
      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: Date.now().toLocaleString(),
      };
      return req.session.save((err) => {
        return res.redirect("/user/profile");
      });
    });
  });
};
exports.getSignup = (req, res, next) => {
  return res.render("signup", {
    pageTitle: "Sign Up Page",
  });
};

exports.postSignup = (req, res, next) => {
  const body = req.body;
  //   console.log(body);
  User.findOne({
    email: body.email,
  }).then((user) => {
    console.log(user);
    if (user !== null) {
    }
    let compName = null;
    let occupation = null;
    let experience = null;
    if (typeof body["comp-name"] === "string") {
      compName = body["comp-name"].split("\n");
      experience = body["experience"].split("\n");
      occupation = body["occupation"].split("\n");
    } else {
      compName = body["comp-name"];
      experience = body["experience"];
      occupation = body["occupation"];
    }
    let profession = compName.map((ele, i) => {
      return {
        company: ele,
        occupation: occupation[i],
        experience: experience[i],
      };
    });
    // console.log(profession);
    return bcryptjs.hash(body.password, 10).then((hashedPassword) => {
      const user = new User({
        name: body.name,
        email: body.email,
        mobile: body["mob-no"],
        address: body.address,
        city: body.city,
        state: body.state,
        profession: profession,
        country: body.country,
        password: hashedPassword,
      });

      return user.save().then((saved) => {
        req.session.logged = true;
        req.session.user = {
          _id: saved._id,
          name: saved.name,
          email: saved.email,
          createdAt: Date.now().toLocaleString(),
        };
        return req.session.save((err) => {
          return res.redirect("/user/profile");
        });
      });
    });
  });
};
