import React, { useState, useEffect } from "react";
import { useGo, useTranslate } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { restaurantService, categoryService, Category } from "../../../../services";

export const MenuItemCreate = () => {
  const t = useTranslate();
  const go = useGo();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const {
    refineCore: { onFinish },
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "menu-items",
      action: "create",
    },
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      restaurantId: Number(restaurantId),
      categoryId: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await restaurantService.createMenuItem({
        ...data,
        restaurantId: Number(restaurantId),
        price: Number(data.price),
        categoryId: Number(data.categoryId),
      });
      go({
        to: `/admin/restaurants/${restaurantId}/menu-items`,
        type: "replace",
      });
    } catch (error) {
      console.error("Error creating menu item:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      // Save file name
      onChange(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (onChange: (value: string) => void) => {
    setImagePreview(null);
    onChange("");
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => go({ to: `/admin/restaurants/${restaurantId}/menu-items` })}
        >
          Back
        </Button>
        <Typography variant="h5">Create Menu Item</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("menuItems.fields.name")}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message as string}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("menuItems.fields.description")}
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message as string}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categoryId}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        {...field}
                        label="Category"
                        disabled={loading}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.categoryId && (
                        <Typography color="error" variant="caption">
                          {errors.categoryId.message as string}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("menuItems.fields.price")}
                      fullWidth
                      type="number"
                      error={!!errors.price}
                      helperText={errors.price?.message as string}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        onChange={(e) => handleImageChange(e, onChange)}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <label htmlFor="image-upload">
                            <Button
                              variant="outlined"
                              component="span"
                            >
                              Choose Image
                            </Button>
                          </label>
                          {imagePreview && (
                            <Box sx={{ width: 100, height: 100, borderRadius: 1, overflow: 'hidden' }}>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                        <TextField
                          fullWidth
                          label={t("menuItems.fields.imageUrl")}
                          value={value || ""}
                          onChange={(e) => onChange(e.target.value)}
                          error={!!errors.imageUrl}
                          helperText={errors.imageUrl?.message as string}
                        />
                      </Box>
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      go({ to: `/admin/restaurants/${restaurantId}/menu-items` })
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Create
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}; 