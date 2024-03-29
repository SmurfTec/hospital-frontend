import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import checkIcon from '@iconify/icons-eva/checkmark-circle-2-fill';
import crossIcon from '@iconify/icons-eva/close-circle-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import AssignmentIcon from '@material-ui/icons/Assignment';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

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
  removeFromSlug,
  noDelete,
  noEdit,
  viewTask,
  viewLink,
  role,
  status
}) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const theme = useTheme();
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
        {!noDelete && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
            <ListItemIcon>
              <Icon
                color={theme.palette.success.main}
                icon={trash2Outline}
                width={24}
                height={24}
              />
            </ListItemIcon>
            <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {!noEdit && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
            <ListItemIcon>
              <Icon color={theme.palette.error.main} icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}{' '}
        {role === 'Appointment' && (
          <>
            {status === 'pending' ? (
              <>
                <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
                  <ListItemIcon>
                    <Icon
                      color={theme.palette.success.main}
                      icon={checkIcon}
                      width={24}
                      height={24}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Accept" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
                <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
                  <ListItemIcon>
                    <Icon
                      color={theme.palette.error.main}
                      icon={checkIcon}
                      width={24}
                      height={24}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Reject" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
                  <ListItemIcon>
                    <Icon icon={checkIcon} width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText primary="Admit" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
                <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
                  <ListItemIcon>
                    <Icon icon={crossIcon} width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText primary="Discharge" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
              </>
            )}
          </>
        )}
        {addToTable && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleAddTo}>
            <ListItemIcon>
              <Icon icon={plusFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={addToSlug} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {removeFromTable && (
          <MenuItem
            sx={{ color: 'text.secondary' }}
            onClick={() => {
              setIsOpen(false);
              handleRemoveFrom();
            }}
          >
            <ListItemIcon>
              <Icon icon={minusFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={removeFromSlug} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {viewTask && (
          <MenuItem
            sx={{ color: 'text.secondary' }}
            onClick={() => navigate(viewLink, { replace: true })}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="View Task" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
