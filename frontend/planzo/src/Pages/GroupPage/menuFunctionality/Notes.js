import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Plus,
  X,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useGroupChatService } from "../../../services/chatService";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

const Notes = () => {
  const { chatId } = useParams();
  const textareaRef = useRef(null);
  const {user} = useAuth0

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const groupChatService = useGroupChatService();

  // Auto-resize textarea
  useEffect(() => {
    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    if (editingId) {
      adjustHeight();
    }
  }, [editText, editingId]);

  // Fetch notes when chatId changes
  useEffect(() => {
    const fetchNotes = async () => {
      if (chatId) {
        try {
          setLoading(true);
          setError(null);
          const fetchedNotes = await groupChatService.getNotes(chatId);
          setNotes(fetchedNotes);
        } catch (error) {
          console.error("Error fetching notes:", error);
          setError("Failed to load notes. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotes();
  }, [chatId]);

  // Error handling and CRUD methods remain the same as in the original component
  const handleAddNote = async () => {
    if (newNote.trim() && chatId) {
      try {
        setError(null);
        const addedNote = await groupChatService.addNote(chatId, {
          text: newNote,
          isImportant: false,
        });

        setNotes((prevNotes) => [addedNote, ...prevNotes]);
        setNewNote("");
      } catch (error) {
        console.error("Error adding note:", error);
        setError("Failed to add note. Please try again.");
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setError(null);
      await groupChatService.deleteNote(chatId, noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

      if (editingId === noteId) {
        setEditingId(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() && chatId) {
      try {
        setError(null);
        const updatedNote = await groupChatService.updateNote(
          chatId,
          editingId,
          {
            text: editText,
          }
        );

        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === editingId ? updatedNote : note))
        );

        setEditingId(null);
        setEditText("");
      } catch (error) {
        console.error("Error saving note:", error);
        setError("Failed to save note. Please try again.");
      }
    }
  };

  const toggleImportance = async (noteId) => {
    try {
      setError(null);
      const note = notes.find((n) => n.id === noteId);
      const updatedNote = await groupChatService.updateNote(chatId, noteId, {
        isImportant: !note.isImportant,
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error toggling note importance:", error);
      setError("Failed to update note importance. Please try again.");
    }
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-blue-500" />
          Trip Notes
        </h3>
      </div>

      {/* Add Note Input */}
      <div className="mb-6 flex space-x-3">
        <div className="flex-1">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add an important note..."
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none transition-all duration-300"
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && handleAddNote()
            }
          />
        </div>
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="self-start px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <AnimatePresence>
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-gray-500"
            >
              No notes yet. Start by adding your first note!
            </motion.div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    note.isImportant
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200"
                  } shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <textarea
                        ref={textareaRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words flex-1 pr-3">
                          {note.text}
                        </p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => toggleImportance(note.id)}
                            className={`p-2 rounded-full transition-colors ${
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
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(note)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Edit note"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-right">
                        {formatDate(note.createdAt)}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Notes;
