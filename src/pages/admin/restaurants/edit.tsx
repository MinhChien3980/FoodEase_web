import React, { useEffect, useState } from "react";
import { useTranslate, useNavigation } from "@refinedev/core";
import { useParams } from "react-router";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { restaurantService, Restaurant } from "../../../services";

export const RestaurantEdit = () => {
  const t = useTranslate();
  const { push } = useNavigation();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurant = await restaurantService.getRestaurantById(Number(id));
        setValue("name", restaurant.name);
        setValue("address", restaurant.address);
        setValue("description", restaurant.description);
        setValue("phone", restaurant.phone);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await restaurantService.updateRestaurant(Number(id), data);
      push("/admin/restaurants");
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  return (
    <Edit
      saveButtonProps={{
        onClick: handleSubmit(onSubmit),
      }}
      isLoading={loading}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!errors.name}
          helperText={errors.name?.message as string}
          margin="normal"
          fullWidth
          label={t("restaurants.fields.name")}
          name="name"
          autoFocus
        />
        <TextField
          {...register("address", {
            required: "This field is required",
          })}
          error={!!errors.address}
          helperText={errors.address?.message as string}
          margin="normal"
          fullWidth
          label={t("restaurants.fields.address")}
          name="address"
        />
        <TextField
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message as string}
          margin="normal"
          fullWidth
          label={t("restaurants.fields.description")}
          name="description"
          multiline
          rows={4}
        />
        <TextField
          {...register("phone", {
            required: "This field is required",
          })}
          error={!!errors.phone}
          helperText={errors.phone?.message as string}
          margin="normal"
          fullWidth
          label={t("restaurants.fields.phone")}
          name="phone"
        />
      </Box>
    </Edit>
  );
}; 