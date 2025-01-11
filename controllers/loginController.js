// controllers/loginController.js

async function loginGET(req, res) {
  var titles = req.user ? "Logout" : "Login";
  res.render("login", {
    title: titles,
    user: req.user,
    data: {
      username: "",
      password: "",
    }, // Empty fields for initial load
  });
}

module.exports = {
  loginGET,
};
