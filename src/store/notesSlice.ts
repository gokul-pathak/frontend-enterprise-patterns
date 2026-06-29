import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesState {
  items: Note[];
  isInitialized: boolean;
}

const initialState: NotesState = {
  items: [],
  isInitialized: false,
};

// Local storage key for persistence
const STORAGE_KEY = 'frontend-portfolio-notes';

function loadNotesFromStorage(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load notes from storage', error);
    return [];
  }
}

function saveNotesToStorage(notes: Note[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to storage', error);
  }
}

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    initNotes: (state) => {
      state.items = loadNotesFromStorage();
      state.isInitialized = true;
    },
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt'>>) => {
      const newNote: Note = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newNote); // Add to the beginning
      saveNotesToStorage(state.items);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.items.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveNotesToStorage(state.items);
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
      saveNotesToStorage(state.items);
    },
  },
});

export const { initNotes, addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
