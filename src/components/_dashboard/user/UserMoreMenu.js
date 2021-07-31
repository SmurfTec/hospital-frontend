import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function UserMoreMenu({
  currentUser,
  setSelected,
  toggleDelOpen,
  toggleEditOpen,
  addToTable,
  toggleAddToOpen,
  addToSlug,
  removeFromTable,
  handleRemoveFrom,
  removeFromSlug
}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    setSelected(currentUser._id);
    setIsOpen(false);
    toggleDelOpen();
  };
  const handleEdit = () => {
    setSelected(currentUser);
    setIsOpen(false);
    toggleEditOpen();
  };
  const handleAddTo = () => {
    setIsOpen(false);
    toggleAddToOpen();
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {addToTable && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleAddTo}>
            <ListItemIcon>
              <Icon icon={plusFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={addToSlug} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {removeFromTable && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleRemoveFrom}>
            <ListItemIcon>
              <Icon icon={minusFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={removeFromSlug} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
