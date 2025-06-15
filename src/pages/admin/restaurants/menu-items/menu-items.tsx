import React, { useEffect, useState } from "react";
import { useGo } from "@refinedev/core";
import { useParams } from "react-router";
import { CreateButton, EditButton, useDataGrid, DeleteButton } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { RefineListView } from "../../../../components";
import { restaurantService, Restaurant, MenuItem } from "../../../../services";
import { Stack, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslate } from "@refinedev/core";

export const RestaurantMenuItems = () => {
  const { id } = useParams();
  const go = useGo();
  const t = useTranslate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantData, menuItemsData] = await Promise.all([
          restaurantService.getRestaurantById(Number(id)),
          restaurantService.getMenuItemsByRestaurantId(Number(id))
        ]);
        setRestaurant(restaurantData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columns: GridColDef<MenuItem>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: t("menuItems.fields.name"),
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: t("menuItems.fields.description"),
      minWidth: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: t("menuItems.fields.price"),
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(row.price);
      },
    },
    {
      field: "actions",
      headerName: t("table.actions"),
      type: "actions",
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Stack direction="row" spacing={1}>
            <EditButton
              hideText
              recordItemId={row.id}
              resource="menu-items"
              svgIconProps={{
                color: "action",
              }}
            />
            <DeleteButton
              hideText
              recordItemId={row.id}
              resource="menu-items"
              svgIconProps={{
                color: "error",
              }}
              onSuccess={() => {
                setMenuItems((prevItems) => 
                  prevItems.filter((item) => item.id !== row.id)
                );
              }}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <RefineListView
      title=""
      headerButtons={() => [
        <CreateButton
          key="create"
          variant="contained"
          size="medium"
          sx={{ height: "40px" }}
          onClick={() => {
            go({
              to: `/admin/restaurants/${id}/menu-items/create`,
              query: {
                restaurantId: id,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("menuItems.actions.add")}
        </CreateButton>,
      ]}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ArrowBackIcon 
          onClick={() => go({ to: "/admin/restaurants" })}
          sx={{ cursor: 'pointer' }}
        />
        <Typography variant="h5">
          {restaurant?.name} - {t("menuItems.titles.list")}
        </Typography>
      </Box>

      <DataGrid
        rows={menuItems}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
      />
    </RefineListView>
  );
}; 