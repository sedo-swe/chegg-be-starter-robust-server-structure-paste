const router = require("express").Router();
const controller = require("./notes.controller");
const ratingsRouter = require("../ratings/ratings.router");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.use("/:noteId/ratings", controller.noteExists, ratingsRouter);
router
  .route("/:noteId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);
router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

module.exports = router;
