// controllers/indexController.js
async function indexGET(req, res) {
  //   const messages = await db.getMessages();

  res.render("index", {
    title: "Home Page",
    user: req.user,
    // messages: messages,
  });
}

// async function deletePOST(req, res) {
//   console.log(req.params.id);
//   const messageId = req.params.id;

//   await db.deleteMessage(messageId);
//   res.redirect("/");
// }

module.exports = {
  indexGET,
  //   deletePOST,
};
