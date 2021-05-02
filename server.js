const express = require('express');
const path = require('path')
const fs = require('fs')

const PORT = 3000

const app = process.env.PORT || express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) throw err
        const notes = JSON.parse(jsonString);
        notes.push(req.body)
        const newNotesString = JSON.stringify(notes)
        fs.writeFile('./db/db.json', newNotesString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                res.json({ ok: true });
                console.log('Successfully wrote file')
            }
        })
    })
    

})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
