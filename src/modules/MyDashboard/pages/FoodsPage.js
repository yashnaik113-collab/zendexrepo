import React from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import DishCard from '../components/DishCard';
import FoodFormDialog from '../components/FoodFormDialog';
import { useDashboard } from '../context/DashboardContext';
import { useToast } from '../components/Toast';

const FoodsPage = () => {
  const { foods, createDish, updateDish, deleteDish, toggleDishAvailability, loading } = useDashboard();
  const { showToast, ToastComponent } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingDish, setEditingDish] = React.useState(null);

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDish(null);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingDish) {
        await updateDish(editingDish._id, payload);
        showToast('Dish updated successfully', 'success');
      } else {
        await createDish(payload);
        showToast('Dish added successfully', 'success');
      }
      closeDialog();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleDelete = async (dish) => {
    try {
      await deleteDish(dish._id, dish.foodName);
      showToast('Dish deleted from menu', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleToggle = async (dish, isAvailable) => {
    try {
      await toggleDishAvailability(dish._id, isAvailable, dish.foodName);
      showToast(`${dish.foodName} ${isAvailable ? 'is back in stock' : 'is now out of stock'}`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Food Management
          </Typography>
          <Typography sx={{ color: 'rgba(226,232,240,0.72)' }}>
            Add, edit, delete, and toggle dishes here. Customer menu pages pick up backend changes on the next sync.
          </Typography>
        </Box>
        <Button
          startIcon={<AddRounded />}
          onClick={() => setDialogOpen(true)}
          variant="contained"
          sx={{ borderRadius: 99, alignSelf: 'flex-start', bgcolor: '#f97316' }}
        >
          Add New Dish
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {foods.map((dish) => (
          <Grid item xs={12} md={6} xl={4} key={dish._id}>
            <DishCard
              dish={dish}
              busy={loading.action}
              onEdit={(value) => {
                setEditingDish(value);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          </Grid>
        ))}
      </Grid>

      <FoodFormDialog
        open={dialogOpen}
        mode={editingDish ? 'edit' : 'create'}
        initialValue={editingDish}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        busy={loading.action}
      />
      <ToastComponent />
    </Box>
  );
};

export default FoodsPage;
