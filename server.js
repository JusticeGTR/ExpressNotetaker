const express = require('express');
const path = require('path')
const fs = require('fs')
const { nanoid } = require('nanoid')
const id = nanoid();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.get('/api/notes/:id', (req, res) => {
    const chosen = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) throw err
        const notes = JSON.parse(jsonString);

        for (let i = 0; i < notes.length; i++) {
            if (chosen === notes[i].id) {
                return res.json(notes[i]);
            }
        }

        return res.json(false)
    })
})

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) throw err
        const notes = JSON.parse(jsonString);
        req.body.id = id
        notes.push(req.body)
        const newNotesString = JSON.stringify(notes)
        fs.writeFile('./db/db.json', newNotesString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                res.json    ({ ok: true });
                console.log('Successfully wrote file')
            }
        })
    })


})

app.delete('/api/notes/:id', (req, res) => {
    const chosen = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) throw err
        const notes = JSON.parse(jsonString);
        // var filtered = array.filter(function(value, index, arr){ 
        //     return value > 5;
        // });
        const newNotes = notes.filter((note) =>{
            return note.id !== chosen;
        })
        const newNotesString = JSON.stringify(newNotes)
        fs.writeFile('./db/db.json', newNotesString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                res.json    ({ ok: true });
                console.log('Successfully wrote file')
            }
        })
    })
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
