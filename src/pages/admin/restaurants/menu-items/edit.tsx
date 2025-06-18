import React, { useEffect, useState } from "react";
import { useGo, useTranslate } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem as MuiMenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { restaurantService, categoryService, Category } from "../../../../services";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: number;
  categoryId: number;
}

export const MenuItemEdit = () => {
  const t = useTranslate();
  const go = useGo();
  const { menuItemId } = useParams();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItem, setMenuItem] = useState<MenuItemFormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    refineCore: { onFinish },
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MenuItemFormData>({
    refineCoreProps: {
      resource: "menu-items",
      action: "edit",
      id: menuItemId,
    },
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      restaurantId: Number(restaurantId),
      categoryId: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuItemData, categoriesData] = await Promise.all([
          restaurantService.getMenuItemById(Number(menuItemId)),
          categoryService.getAllCategories()
        ]);
        setMenuItem(menuItemData);
        setCategories(categoriesData);
        
        // Reset form with the fetched menu item data
        reset({
          name: menuItemData.name,
          description: menuItemData.description,
          price: menuItemData.price,
          imageUrl: menuItemData.imageUrl || "",
          restaurantId: menuItemData.restaurantId,
          categoryId: menuItemData.categoryId,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menuItemId, reset]);

  const onSubmit = async (data: MenuItemFormData) => {
    try {
      console.log('Form Data:', data);
      const updateData = {
        id: Number(menuItemId),
        restaurantId: Number(data.restaurantId),
        categoryId: Number(data.categoryId),
        name: data.name,
        description: data.description,
        price: Number(data.price),
        imageUrl: data.imageUrl
      };
      console.log('Update Data to API:', updateData);
      
      await restaurantService.updateMenuItem(Number(menuItemId), updateData);
      go({
        to: `/admin/restaurants/${data.restaurantId}/menu-items`,
        type: "replace",
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => go({ to: `/admin/restaurants/${menuItem?.restaurantId}/menu-items` })}
        >
          Back
        </Button>
        <Typography variant="h5">Edit Menu Item</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit as any)}>
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
                          <MuiMenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MuiMenuItem>
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
                      go({ to: `/admin/restaurants/${menuItem?.restaurantId}/menu-items` })
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Save
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