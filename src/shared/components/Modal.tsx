'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Standardized modal with focus trap (built into MUI Dialog).
 * Separating Modal from the content inside it follows the
 * "container vs. presentational" pattern — easier to test and reuse.
 */
export function Modal({ open, onClose, title, children, actions, maxWidth = 'sm' }: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="modal-title"
    >
      <DialogTitle
        id="modal-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton aria-label="close modal" onClick={onClose} size="small" sx={{ ml: 1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
}
