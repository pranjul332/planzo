import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  X,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
} from "lucide-react";

const Notes = ({ chatId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated fetch notes based on chat ID
  useEffect(() => {
    if (chatId) {
      setLoading(true);
      // Mock API call - in a real app this would fetch from your backend
      setTimeout(() => {
        // Sample data - would come from API in real app
        const mockNotes = localStorage.getItem(`notes-${chatId}`)
          ? JSON.parse(localStorage.getItem(`notes-${chatId}`))
          : [];

        setNotes(mockNotes);
        setLoading(false);
      }, 500);
    }
  }, [chatId]);

  // Save notes to localStorage (simulating backend storage)
  const saveNotesToStorage = (updatedNotes) => {
    if (chatId) {
      localStorage.setItem(`notes-${chatId}`, JSON.stringify(updatedNotes));
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [
        ...notes,
        {
          id: Date.now(),
          text: newNote,
          createdAt: new Date().toISOString(),
          isImportant: false,
        },
      ];

      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setNewNote("");
    }
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId ? { ...note, text: editText } : note
      );

      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const toggleImportance = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isImportant: !note.isImportant } : note
    );

    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-blue-500" />
        Important Trip Notes
      </h3>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add an important note..."
          className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onKeyPress={(e) => e.key === "Enter" && handleAddNote()}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {notes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No notes yet. Add your first note above.
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {notes
                .sort(
                  (a, b) =>
                    b.isImportant - a.isImportant ||
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                .map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg border ${
                      note.isImportant
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200"
                    } shadow-sm`}
                  >
                    {editingId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                            {note.text}
                          </p>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => toggleImportance(note.id)}
                              className={`p-1 rounded ${
                                note.isImportant
                                  ? "text-blue-500 hover:bg-blue-100"
                                  : "text-gray-400 hover:bg-gray-100"
                              }`}
                              title={
                                note.isImportant
                                  ? "Unmark as important"
                                  : "Mark as important"
                              }
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(note)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit note"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {formatDate(note.createdAt)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
