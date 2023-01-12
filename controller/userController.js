const User = require("../models/user");
const Project = require("../models/project");

let fillValuesForProject = (req, body) => {
  req.flash("name", body["project-name"]);
  req.flash("category", body["project-category"]);
  req.flash("description", body["project-desc"]);
  req.flash("start", body["project-start"]);
  req.flash("end", body["project-end"]);
  req.flash("notes", body["project-notes"]);
};

exports.getProfile = (req, res, next) => {
  const id = req.session.user._id
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      // console.log(user);
      return res.render("profile", {
        pageTitle: "User Profile",
        profile: user,
        path: "/profile",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProjectSubmit = (req, res, next) => {
  let start = req.flash("start");
  start = start.length === 0 ? "" : new Date(start[0]);
  let end = req.flash("end");
  end = end.length === 0 ? "" : new Date(end[0]);
  return res.render("project-form.ejs", {
    pageTitle: "Project Submit",
    path: "/project-submit",
    data: {
      name: req.flash("name"),
      description: req.flash("description"),
      category: req.flash("category"),
      start:
        start == ""
          ? ""
          : start.getFullYear() +
            "-" +
            (1 + start.getMonth() <= 9 ? "0" : "") +
            (1 + start.getMonth()) +
            "-" +
            (start.getDate() <= 9 ? "0" : "") +
            start.getDate(),
      end:
        end == ""
          ? ""
          : end.getFullYear() +
            "-" +
            (1 + end.getMonth() <= 9 ? "0" : "") +
            (1 + end.getMonth()) +
            "-" +
            (end.getDate() <= 9 ? "0" : "") +
            end.getDate(),
      notes: req.flash("notes"),
    },
    // start.getFullYear()+'-'+(1+start.getMonth()<=9?'0':'')+(1+start.getMonth())+'-'+(start.getDate())<=9?'0':'')+(start.getDate())
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

exports.getProjectList = (req, res, next) => {
  let userIn = null;
  // const imageList=['/assets/img.png','/assets/project-2.jpg','/assets/project-2.png','/assets/project.png'];
  // User.findById('6289020415af4bd7449ad014')
  // .then((user)=>{
  //     userIn=user;
  //     return user.populate({
  //         path: 'projects.id',
  //         model: 'Project'
  //     });
  // })
  req.user
    .populate({
      path: "projects.id",
      model: "Project",
    })
    .then((project) => {
      console.log(project.projects);
      return res.render("project-list", {
        pageTitle: "Project List",
        path: "/project-list",
        projects: project.projects,
        success: req.flash("success"),
      });
    });
};

exports.postProjectSubmit = (req, res, next) => {
  const body = req.body;
  const start = new Date(body["project-start"]);
  const end = new Date(body["project-end"]);
  if (end <= start) {
    req.flash("error", "endBeforeStart");
    fillValuesForProject(req, body);
    return res.redirect("/user/project-submit");
  }
  Project.findOne({
    name: body["project-name"],
    category: body["project-category"],
  }).then((proj) => {
    if (proj != null && proj.userId.toString() === req.user._id.toString()) {
      req.flash("error", "projectExists");
      fillValuesForProject(req, body);
      return res.redirect("/user/project-submit");
    }
    const project = new Project({
      name: body["project-name"],
      category: body["project-category"],
      description: body["project-desc"],
      start: new Date(body["project-start"]),
      end: new Date(body["project-end"]),
      notes: body["project-notes"],
      userId: req.user._id,
    });

    return project
      .save()
      .then((projectSaved) => {
        req.user.projects.push({
          id: projectSaved._id,
        });
        return req.user.save();
      })
      .then((user) => {
        req.flash(
          "success",
          "You have successfully added this project to your portfolio."
        );
        return res.redirect("/user/project-submit");
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    return res.redirect("/login");
  });
};

exports.postDeleteProject = (req, res, next) => {
  const body = req.body;
  Project.findByIdAndDelete(body["project-id"])
    .then((project) => {
      // console.log(req.user.projects);
      req.user.projects = req.user.projects.filter(
        (project) => project.id.toString() !== body["project-id"]
      );
      // console.log(val);
      return req.user.save();
    })
    .then((user) => {
      req.flash("success", "You have deleted the project successfully");
      return res.redirect("/user/project-list");
    });
};
