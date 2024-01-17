const pastes = require("../data/pastes-data");

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

// function bodyHasTextProperty(req, res, next) {
//     const { data: { text } = {} } = req.body;
//     if (text) {
//       return next(); // Call `next()` without an error messsage if the result exists
//     }
//     next({
//       status: 400,
//       message: "A 'text' property is required."
//     });
// }
function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
}

function exposurePropertyIsValid(req, res, next) {
    const { data: { exposure } = {} } = req.body;
    const validExposure = ["private", "public"];
    if (validExposure.includes(exposure)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
    });
}
  
function syntaxPropertyIsValid(req, res, next) {
    const { data: { syntax } = {} } = req.body;
    const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
    if (validSyntax.includes(syntax)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
    });
}
  
function expirationIsValidNumber(req, res, next){
    const { data: { expiration }  = {} } = req.body;
    if (expiration <= 0 || !Number.isInteger(expiration)){
        return next({
            status: 400,
            message: `Expiration requires a valid number`
        });
    }
    next();
}
  
function create(req, res) {
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
}

function list(req, res) {
    const { userId } = req.params;
    console.log("userID: "+userId);
    res.json({ data: pastes.filter(userId ? paste => paste.user_id == userId : () => true) });
}

function pasteExists(req, res, next) {
    const { pasteId } = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    if (foundPaste) {
        res.locals.paste = foundPaste;
        return next();
    }
    next({
      status: 404,
      message: `Paste id not found: ${pasteId}`,
    });
}
  
function read(req, res) {
    // const { pasteId } = req.params;
    // const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    const foundPaste = res.locals.paste;
    res.json({ data: foundPaste });
}

function update(req, res) {
    // const { pasteId } = req.params;
    // const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    const foundPaste = res.locals.paste;
    const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
  
    // Update the paste
    foundPaste.name = name;
    foundPaste.syntax = syntax;
    foundPaste.expiration = expiration;
    foundPaste.exposure = exposure;
    foundPaste.text = text;
  
    res.json({ data: foundPaste });
}

function destroy(req, res) {
    const { pasteId } = req.params;
    const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedPastes = pastes.splice(index, 1);
    res.sendStatus(204);
}

module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        bodyDataHas("user_id"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        create
    ],
    list,
    read: [pasteExists, read],
    update: [
        pasteExists,
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        update
    ],
    delete: [pasteExists, destroy],
};