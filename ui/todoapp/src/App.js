// Import necessary modules and styles
import './App.css';
import { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    // Initialize state to hold the list of notes
    this.state = {
      notes: []
    };
  }

  // Base URL for the API endpoints
  API_URL = "http://localhost:5038/";

  // Fetch notes from the server when the component mounts
  componentDidMount() {
    this.refreshNotes();
  }

  // Method to retrieve the notes from the API and update the state
  async refreshNotes() {
    fetch(this.API_URL + "api/todoapp/GetNotes")
      .then(response => response.json())
      .then(data => {
        this.setState({ notes: data });
      })
      .catch(error => console.error("Error fetching notes:", error));
  }

  // Method to add a new note, sending it to the API as form data
  async addClick() {
    var newNotes = document.getElementById("newNotes").value;
    const data = new FormData();
    data.append("NewNotes", newNotes);  // 'NewNotes' should match the backend field name

    fetch(this.API_URL + "api/todoapp/AddNotes", {
      method: "POST",
      body: data,
    })
      .then(res => res.json())
      .then(result => {
        alert(result);             // Notify user of the addition result
        this.refreshNotes();       // Refresh notes list to show the new entry
      })
      .catch(error => console.error("Error adding note:", error));
  }

  // Method to delete a note by ID, sending a DELETE request to the API
  async deleteClick(id) {
    fetch(this.API_URL + "api/todoapp/DeleteNotes?id=" + id, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(result => {
        alert(result);             // Notify user of the deletion result
        this.refreshNotes();       // Refresh notes list to remove the deleted entry
      })
      .catch(error => console.error("Error deleting note:", error));
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
        <h2>To Do App</h2>
        <input id="newNotes" placeholder="Enter a new note" />&nbsp;
        <button onClick={() => this.addClick()}>Add Notes</button>
        {/* Map over the notes array to display each note with a delete button */}
        {notes.map(note =>
          <p key={note.id}>
            <b>{note.id + ". "}{note.description}</b>&nbsp;
            <button onClick={() => this.deleteClick(note.id)}>Delete Notes</button>
          </p>
        )}
      </div>
    );
  }
}

export default App;
