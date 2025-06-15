import React from "react";
import { useTranslate } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router";
import { restaurantService } from "../../../services";

export const RestaurantCreate = () => {
  const t = useTranslate();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await restaurantService.createRestaurant(data);
      navigate("/admin/restaurants");
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <Create
      saveButtonProps={{
        onClick: handleSubmit(onSubmit),
      }}
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
    </Create>
  );
}; 