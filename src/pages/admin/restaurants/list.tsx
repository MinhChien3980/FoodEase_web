import React, { useEffect, useState } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, EditButton, useDataGrid, DeleteButton } from "@refinedev/mui";
import { useLocation } from "react-router";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { RefineListView } from "../../../components";
import { restaurantService, Restaurant } from "../../../services";
import { Stack } from "@mui/material";

export const RestaurantList = () => {
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const t = useTranslate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuModalOpen, setMenuModalOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const columns: GridColDef<Restaurant>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            #{row.id}
          </Typography>
        );
      },
    },
    {
      field: "name",
      headerName: t("restaurants.fields.name"),
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: t("restaurants.fields.address"),
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "menuItems",
      headerName: "Menu Items",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            {row.menuItems?.length || 0}
          </Typography>
        );
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
              svgIconProps={{
                color: "action",
              }}
            />
            <DeleteButton
              hideText
              recordItemId={row.id}
              resource="restaurants"
              svgIconProps={{
                color: "error",
              }}
              onSuccess={() => {
                setRestaurants((prevRestaurants) => 
                  prevRestaurants.filter((restaurant) => restaurant.id !== row.id)
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
      headerButtons={() => [
        <CreateButton
          key="create"
          variant="contained"
          size="medium"
          sx={{ height: "40px" }}
          onClick={() => {
            go({
              to: `${createUrl("restaurants")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("restaurants.actions.add")}
        </CreateButton>,
      ]}
    >
      <DataGrid
        rows={restaurants}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        onRowClick={(params) => {
          go({
            to: `/admin/restaurants/${params.row.id}/menu-items`,
            type: "replace",
          });
        }}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </RefineListView>
  );
}; 