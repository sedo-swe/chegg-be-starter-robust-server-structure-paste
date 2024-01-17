const path = require("path");
const ratings = require(path.resolve("src/data/ratings-data"));

// function create(req, res) {
//   const { data: { text } = {} } = req.body;
//   const newNote = {
//     id: notes.length + 1,
//     text,
//   };
//   notes.push(newNote);
//   res.status(201).json({ data: newNote });
// }

// function destroy(req, res) {
//   const { noteId } = req.params;
//   const index = notes.findIndex((note) => note.id === Number(noteId));
//   if (index > -1) {
//     notes.splice(index, 1);
//   }
//   res.sendStatus(204);
// }

// function hasText(req, res, next) {
//   const { data: { text } = {} } = req.body;

//   if (text) {
//     return next();
//   }
//   next({ status: 400, message: "A 'text' property is required." });
// }

function list(req, res) {
  const { noteId } = req.params;
  console.log("noteId: " + noteId + ", " + req.params);
  console.log(req.params);
  res.json({ data: ratings.filter(noteId ? rating => rating.noteId == noteId : () => true) });
}

function noteExists(req, res, next) {
  const { ratingId } = req.params;
  console.log(req.params);
  const foundRating = ratings.find((rating) => rating.id === Number(ratingId));
  if (foundRating) {
    return next();
  }
  next({
    status: 404,
    message: `Rating id not found: ${req.params.ratingId}`,
  });
}

function read(req, res) {
  const { ratingId } = req.params;
  console.log(req.params);
  const foundRating = ratings.find((rating) => (rating.id === Number(ratingId)));
  res.json({ data: foundRating });
}

// function update(req, res) {
//   const noteId = Number(req.params.noteId);
//   const foundNote = notes.find((note) => note.id === noteId);

//   const { data: { text } = {} } = req.body;

//   foundNote.text = text;

//   res.json({ data: foundNote });
// }

module.exports = {
//   create: [hasText, create],
  list,
  read: [noteExists, read],
//   update: [noteExists, hasText, update],
//   delete: destroy,
};
