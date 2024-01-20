const path = require("path");
const uses = require(path.resolve("src/data/uses-data"));

// function create(req, res) {
//   const { data: { text } = {} } = req.body;
//   const newNote = {
//     id: notes.length + 1,
//     text,
//   };
//   notes.push(newNote);
//   res.status(201).json({ data: newNote });
// }

function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  if (index > -1) {
    uses.splice(index, 1);
  }
  res.sendStatus(204);
}

// function hasText(req, res, next) {
//   const { data: { text } = {} } = req.body;

//   if (text) {
//     return next();
//   }
//   next({ status: 400, message: "A 'text' property is required." });
// }

function list(req, res) {
  const { urlId } = req.params;
  res.json({ data: uses.filter(urlId ? use => use.urlId == urlId : () => true) });
}

function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${req.params.useId}`,
  });
}

function read(req, res) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => (use.id === Number(useId)));
  res.json({ data: foundUse });
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
  read: [useExists, read],
//   update: [useExists, hasText, update],
  delete: [useExists, destroy],
};
