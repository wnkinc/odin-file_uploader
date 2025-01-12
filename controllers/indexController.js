// controllers/indexController.js
async function indexGET(req, res) {
  res.render("index", {
    title: "Home Page",
    user: req.user,
  });
}

module.exports = {
  indexGET,
};
