'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography } from '@mui/material';

import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { noteSchema, type NoteFormValues } from '../schemas/noteSchema';

interface NoteFormProps {
  initialValues?: NoteFormValues;
  onSubmit: (values: NoteFormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function NoteForm({ initialValues, onSubmit, onCancel, isEditing }: NoteFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: initialValues || { title: '', content: '' },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const submitAndReset = (values: NoteFormValues) => {
    onSubmit(values);
    if (!isEditing) {
      reset({ title: '', content: '' });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitAndReset)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6">{isEditing ? 'Edit Note' : 'Create Note'}</Typography>

      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input {...field} label="Title" required errorMessage={errors.title?.message} />
        )}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Content"
            required
            multiline
            rows={4}
            errorMessage={errors.content?.message}
          />
        )}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {isEditing ? 'Update Note' : 'Add Note'}
        </Button>
      </Box>
    </Box>
  );
}
