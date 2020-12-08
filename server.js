let express = require("express");
let path = require("path");
let fs = require("fs")

// Sets up the Express App
// =============================================================
let app = express();
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.post("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return error;
    }

    notes = JSON.parse(notes);

    let id = 0;

    if(notes.length > 0) {
      id = notes[notes.length - 1].id + 1;
    }

    let newNote = { title: req.body.title, text: req.body.text, id: id };
    let activeNote = notes.concat(newNote);

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(activeNote), function (error, data) {
      if (error) {
        return error;
      }

      return res.json(newNote);
    });
  });
});

// Pull from db.json
app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
    if (error) {
      return console.log(error)
    }
    console.log("This is Notes", data)
    res.json(JSON.parse(data))
  })
});

app.delete("/api/notes/:id", function (req, res) {
  const noteId = JSON.parse(req.params.id);

  if(noteId !== undefined ) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
      if (error) {
        return console.log(error);
      }

      notes = JSON.parse(notes);
      notes = notes.filter(val => val.id !== noteId);

      fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
        if (error) {
          return error
        }
        return res.json(notes)
      });
    });
  }else{
    return console.log(error);
  }
});

app.put("/api/notes/:id", function(req, res) {
  const noteId = JSON.parse(req.params.id);

  if(noteId !== "" && noteId !== undefined) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function(error, notes) {
      if (error ){
        return console.log(error);
      }

      notes = JSON.parse(notes)

      let newNote = { title: req.body.title, text: req.body.text, id: req.body.id }

      notes[newNote.id].text = newNote.text;
      notes[newNote.id].title = newNote.title;

      fs.writeFile(__dirname +"/db/db.json", JSON.stringify(notes), function (error, data) {
        if (error) {
          return console.log('pepe');
        }

        return res.json(newNote);
      });
    });
  }
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});