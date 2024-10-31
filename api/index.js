// Import necessary modules
var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer"); // Middleware to handle form data for file uploads

var app = Express();
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB connection string and database name
var CONNECTION_STRING = "mongodb+srv://admin:Aceaceace098@cluster0.rmyqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASENAME = "todoappdb";
var database; // Variable to store the connected MongoDB database

// Start the server on port 5038 and connect to MongoDB
app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("Failed to connect to MongoDB:", error);
            return;
        }
        database = client.db(DATABASENAME);
        console.log("Mongo Connected Successfully");
    });
});

// GET route to retrieve all notes from the collection
app.get('/api/todoapp/GetNotes', (request, response) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        if (error) {
            return response.status(500).send("Failed to retrieve notes");
        }
        response.send(result);
    });
});

// POST route to add a new note to the collection
app.post('/api/todoapp/AddNotes', multer().none(), (request, response) => {
    database.collection("todoappcollection").countDocuments({}, (error, numofDocs) => {
        if (error) {
            return response.status(500).json("Error adding note");
        }
        // Insert new note with an incremented ID based on document count
        database.collection("todoappcollection").insertOne({
            id: (numofDocs + 1).toString(),
            description: request.body.NewNotes  // Ensure the field name matches the frontend
        }, (err, result) => {
            if (err) {
                return response.status(500).json("Failed to add note");
            }
            response.json("Added Successfully");
        });
    });
});

// DELETE route to remove a note by its ID
app.delete('/api/todoapp/DeleteNotes', (request, response) => {
    database.collection("todoappcollection").deleteOne({
        id: request.query.id
    }, (error, result) => {
        if (error) {
            response.status(500).json("Failed to delete note");
        } else {
            response.json("Deleted Successfully");
        }
    });
});
