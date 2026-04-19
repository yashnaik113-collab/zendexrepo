import React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const initialState = {
  dishName: "",
  price: "",
  category: "veg",
  description: "",
  ingredients: "",
  dishType: "veg",
  preparationTime: "",
  tagsInput: "",
  isAvailable: true,
  images: [],
};

const FoodFormDialog = ({
  open,
  mode = "create",
  initialValue,
  onClose,
  onSubmit,
  busy,
}) => {
  const [form, setForm] = React.useState(initialState);

  React.useEffect(() => {
    if (!initialValue) {
      setForm(initialState);
      return;
    }

    setForm({
      dishName: initialValue.foodName || "",
      price: initialValue.price || "",
      category: initialValue.category || "veg",
      description: initialValue.description || "",
      ingredients: (initialValue.tags || []).join(", "),
      dishType: initialValue.category === "non-veg" ? "non-veg" : "veg",
      preparationTime: "",
      tagsInput: (initialValue.tags || []).join(", "),
      isAvailable: Boolean(initialValue.isAvailable),
      images: [],
    });
  }, [initialValue, open]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const tags = form.tagsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const addons = form.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ name: item, price: 0 }));

    const formData = new FormData();
    formData.append("name", form.dishName);
    formData.append("price", form.price);
    formData.append(
      "category",
      form.dishType === "non-veg" ? "non-veg" : form.category,
    );
    formData.append("description", form.description);
    formData.append("isAvailable", String(form.isAvailable));
    formData.append("tags", JSON.stringify(tags)); // ["special thali", "todays special"]
    formData.append("addons", JSON.stringify(addons)); // [{"name":"Extra cheese","price":0}]

    // Append each image file individually
    (form.images || []).forEach((file) => {
      formData.append("images", file);
    });

    onSubmit(formData);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { bgcolor: "#0f172a", color: "white", borderRadius: 5 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "edit" ? "Update dish details" : "Add a new dish"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Dish Name"
                value={form.dishName}
                onChange={(event) =>
                  handleChange("dishName", event.target.value)
                }
                required
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(event) => handleChange("price", event.target.value)}
                required
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Category"
                value={form.category}
                onChange={(event) =>
                  handleChange("category", event.target.value)
                }
                helperText="veg, non-veg, beverages, snacks, dessert or other"
                fullWidth
              />
              <TextField
                label="Preparation Time"
                value={form.preparationTime}
                onChange={(event) =>
                  handleChange("preparationTime", event.target.value)
                }
                placeholder="25 mins"
                fullWidth
              />
            </Stack>

            <TextField
              label="Description"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Ingredients"
              value={form.ingredients}
              onChange={(event) =>
                handleChange("ingredients", event.target.value)
              }
              helperText="Comma separated. Stored as zero-price addons for the current backend."
              fullWidth
            />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Veg / Non Veg"
                value={form.dishType}
                onChange={(event) =>
                  handleChange("dishType", event.target.value)
                }
                helperText="veg or non-veg"
                fullWidth
              />
              <TextField
                label="Tags"
                value={form.tagsInput}
                onChange={(event) =>
                  handleChange("tagsInput", event.target.value)
                }
                helperText="Comma separated tags"
                fullWidth
              />
            </Stack>

            <Stack spacing={1}>
              <Typography sx={{ color: "rgba(226,232,240,0.7)" }}>
                Upload Image
              </Typography>
              <Button
                component="label"
                sx={{
                  width: "fit-content",
                  borderRadius: 99,
                  border: "1px solid rgba(148,163,184,0.24)",
                  color: "white",
                }}
              >
                Choose image files
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    handleChange("images", Array.from(event.target.files || []))
                  }
                />
              </Button>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(form.images || []).map((file) => (
                  <Chip key={`${file.name}-${file.size}`} label={file.name} />
                ))}
              </Stack>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isAvailable}
                  onChange={(event) =>
                    handleChange("isAvailable", event.target.checked)
                  }
                />
              }
              label="Available for customers"
            />

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.2}
              sx={{ pt: 1 }}
            >
              <Button
                onClick={onClose}
                sx={{ borderRadius: 99, color: "rgba(226,232,240,0.76)" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={busy}
                variant="contained"
                sx={{ borderRadius: 99, bgcolor: "#f97316" }}
              >
                {mode === "edit" ? "Save changes" : "Add Dish"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FoodFormDialog;
