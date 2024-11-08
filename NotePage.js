// src/components/NotePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotePage = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    pinned: false,
    image: null,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/'); // Navigate to login page after logout
  };

  const handlePinNote = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes)); // Save to localStorage
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes)); // Save to localStorage
  };

  const handleAddNote = () => {
    const newNoteObj = { ...newNote, id: Date.now() };
    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes)); // Save to localStorage
    setNewNote({ title: '', content: '', pinned: false, image: null });
  };

  const isValidImage = (file) => {
    if (!file) return false; // Check if file exists
    return file.type && file.type.startsWith('image/'); // Check if file is an image
  };

  return (
    <div
      className="container mt-5 d-flex flex-column"
      style={{ minHeight: '100vh' }}
    >
      <h3 className="text-center my-4">My Notes</h3>

      {/* Note creation form */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          className="form-control mb-2"
          rows="4"
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => {
            const file = e.target.files[0];
            if (isValidImage(file)) {
              setNewNote({ ...newNote, image: file });
            } else {
              setNewNote({ ...newNote, image: null });
              alert('Please select a valid image file');
            }
          }}
        />
        <button onClick={handleAddNote} className="btn btn-success w-100">
          Add Note
        </button>
      </div>

      {/* Display notes */}
      <div className="list-group flex-grow-1">
        {notes
          .sort((a, b) => b.pinned - a.pinned)
          .map((note) => (
            <div
              key={note.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{note.title}</h5>
                <p>{note.content}</p>
                {note.image && isValidImage(note.image) && (
                  <img
                    src={URL.createObjectURL(note.image)}
                    alt="Note"
                    className="img-fluid"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div className="d-flex">
                <button
                  onClick={() => handlePinNote(note.id)}
                  className={`btn ${
                    note.pinned ? 'btn-success' : 'btn-secondary'
                  } me-2`}
                >
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Logout Button at the bottom */}
      <div className="d-flex justify-content-center mt-4 mb-3">
        <button onClick={handleLogout} className="btn btn-danger w-50">
          Logout
        </button>
      </div>
    </div>
  );
};

export default NotePage;
