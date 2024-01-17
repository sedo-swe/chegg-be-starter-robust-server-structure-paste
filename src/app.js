const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.
const pastes = require("./data/pastes-data");

// Routers
const usersRouter = require("./users/users.router");
const pastesRouter = require("./pastes/pastes.router");

const notesRouter = require("./notes/notes.router");
const ratingsRouter = require("./ratings/ratings.router");

const urlsRouter = require("./urls/urls.router");
const usesRouter = require("./uses/uses.router");

app.use(express.json());

// app.use("/pastes/:pasteId", (req, res, next) => {
//   const { pasteId } = req.params;
//   const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

//   if (foundPaste) {
//     res.json({ data: foundPaste });
//   } else {
//     next({ status: 404, message: `Paste id not found: ${pasteId}` });
//   }
// });

// app.get("/pastes", (req, res) => {
//   res.json({ data: pastes });
// });
app.use("/pastes", pastesRouter); // Note: app.use
app.use("/users", usersRouter);

app.use("/notes", notesRouter);
app.use("/ratings", ratingsRouter);

app.use("/urls", urlsRouter);
app.use("/uses", usesRouter);

// function bodyHasTextProperty(req, res, next) {
//   const { data: { text } = {} } = req.body;
//   if (text) {
//     return next(); // Call `next()` without an error messsage if the result exists
//   }
//   next({
//     status: 400,
//     message: "A 'text' property is required."
//   });
// }

// // Variable to hold the next ID
// // Because some IDs may already be used, find the largest assigned ID
// let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

// app.post("/pastes", 
//   bodyHasTextProperty,  // Add validation middleware function
//   (req, res, next) => {
//     // Route handler no longer has validation code.
//   const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
//   const newPaste = {
//     id: ++lastPasteId, // Increment last ID, then assign as the current ID
//     name,
//     syntax,
//     exposure,
//     expiration,
//     text,
//     user_id,
//   };
//   pastes.push(newPaste);
//   res.status(201).json({ data: newPaste });
// });

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;


/*
  // post
  {
    "data" : {
      "name" : "Hello World in Ruby",
      "syntax" : "Ruby",
      "expiration" : 15,
      "exposure" : "private",
      "text" : "puts 'helloworld'",
      "user_id" : 5
    }
  }
  
  // put
  {
    "data" : {
      "name" : "Hello World in Ruby",
      "syntax" : "Ruby",
      "expiration" : 15,
      "exposure" : "private",
      "text" : "puts 'helloworld'"
    }
  }
 */