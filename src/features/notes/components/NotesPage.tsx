'use client';

import { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import { PageHeader } from '@/shared/components/PageHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useAppSelector, useAppDispatch } from '@/store';
import { addNote, updateNote, deleteNote, type Note } from '@/store/notesSlice';
import { enqueueNotification } from '@/store/notificationsSlice';
import { NoteForm } from './NoteForm';
import type { NoteFormValues } from '../schemas/noteSchema';

export function NotesPage() {
  const dispatch = useAppDispatch();
  const { items: notes, isInitialized } = useAppSelector((state) => state.notes);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const handleCreateNote = (values: NoteFormValues) => {
    dispatch(addNote(values));
    dispatch(enqueueNotification({ message: 'Note created successfully!', severity: 'success' }));
  };

  const handleUpdateNote = (values: NoteFormValues) => {
    if (editingNote) {
      dispatch(updateNote({ ...editingNote, ...values }));
      setEditingNote(null);
      dispatch(enqueueNotification({ message: 'Note updated successfully!', severity: 'success' }));
    }
  };

  const handleConfirmDelete = () => {
    if (deletingNoteId) {
      dispatch(deleteNote(deletingNoteId));
      setDeletingNoteId(null);
      dispatch(enqueueNotification({ message: 'Note deleted!', severity: 'info' }));
    }
  };

  return (
    <Box>
      <PageHeader
        title="Notes"
        description="A Redux-powered notes app with Zod validation."
        breadcrumbs={[{ label: 'GitHub Stats' }, { label: 'Notes' }]}
      />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ width: { xs: '100%', md: '33.333%' }, position: 'sticky', top: 24 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              {editingNote ? (
                <NoteForm
                  initialValues={editingNote}
                  onSubmit={handleUpdateNote}
                  onCancel={() => setEditingNote(null)}
                  isEditing
                />
              ) : (
                <NoteForm onSubmit={handleCreateNote} />
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '66.666%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!isInitialized && <Typography>Loading notes...</Typography>}
            {isInitialized && notes.length === 0 && (
              <Typography color="text.secondary">No notes yet. Create one on the left!</Typography>
            )}
            
            {notes.map((note) => (
              <Card key={note.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ pr: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {note.title}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                      {note.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => setEditingNote(note)} aria-label="Edit Note">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeletingNoteId(note.id)} color="error" aria-label="Delete Note">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
      </Box>

      <ConfirmDialog
        open={Boolean(deletingNoteId)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingNoteId(null)}
      />
    </Box>
  );
}
