import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Avatar,
  useTheme,
  FormControl,
  FormLabel,
  IconButton,
  Grid,
  Tooltip,
} from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { update_user } from "../interceptor/api";
import { getUserData } from "@/events/getters";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { updateUserSettings } from "@/events/actions";
import DeleteAccountModal from "@/component/Models/DeleteAccountModal";
import { RiPencilFill } from "@remixicon/react";
import dayjs from "dayjs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import openLightbox from "@/component/ImageBox/ImageLightbox";
import { styled } from "@mui/joy/styles";
import Autocomplete from "@mui/joy/Autocomplete";

const ProfileView = () => {
  const userData = getUserData();
  const defaultImage = "https://ui-avatars.com/api/?background=random";
  const [username, setUsername] = useState(userData.username);
  const [mobile, setMobile] = useState(userData.mobile);
  const [email, setEmail] = useState(userData.email);
  const [dateOfBirth, setDateOfBirth] = useState(
    dayjs(userData.dateOfBirth) || null
  );
  const [avatar, setAvatar] = useState(userData.user_profile ?? defaultImage);
  const [profileImage, setProfileImage] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [cityId, setCityId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cities, setCities] = useState([]);
  const [userId, setUserId] = useState(null);
  const theme = useTheme();

  const { t } = useTranslation();

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const id = userId;

      if (!id) {
        toast.error("User ID not found. Please reload the page.");
        setLoading(false);
        return;
      }

      const body = {
        email,
        fullName: username,
        phone: mobile,
        cityId: cityId ? Number(cityId) : null,
        dateOfBirth: dateOfBirth ? dateOfBirth.format("YYYY-MM-DD") : null,
        latitude: latitude ? Number(latitude) : 0,
        longitude: longitude ? Number(longitude) : 0,
        // Add other fields as needed (e.g., langKey, imageUrl, etc.)
      };

      const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (result.code !== 200) {
        toast.error(result.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      updateUserSettings();
      toast.success("Profile updated successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Network error");
      console.error(error);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    "& .MuiInputBase-root": {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.surface,
      padding: "0px 14px",
      "&:hover": {
        backgroundColor: theme.palette.background.body,
        borderColor: "transparent",
      },
      "&.Mui-focused": {
        outline: "none",
        borderColor: theme.palette.primary[500],
        boxShadow: `0 0 0 2px ${theme.palette.primary[200]}`,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.neutral.outlinedBorder,
    },
    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
      padding: "8px 0",
      "&:hover": {
        backgroundColor: theme.palette.background.body,
        border: "none",
      },
    },
    "& .MuiIconButton-root": {
      color: theme.palette.primary[500],
    },
    "& .MuiPickersDay-root": {
      color: theme.palette.text.primary,
      "&:hover": {
        backgroundColor: theme.palette.primary[100],
      },
      "&.Mui-selected": {
        backgroundColor: theme.palette.primary[500],
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary[600],
        },
      },
    },
    "& .MuiPickersCalendarHeader-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiPickersDay-today": {
      borderColor: theme.palette.primary[500],
    },
    // Override MUI styles to remove blue focus ring
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary[500],
        borderWidth: "2px",
      },
    },
  }));
  const CustomDatePicker = (props) => {
    const theme = useTheme();

    return (
      <StyledDatePicker
        {...props}
        slotProps={{
          textField: {
            fullWidth: true,
          },
          day: {
            sx: {
              "&.Mui-selected": {
                backgroundColor: ` ${theme.palette.primary[500]} !important`,
                "&:hover": {
                  backgroundColor: theme.palette.primary[600],
                },
              },
            },
          },
          // Customize the popper to use Joy UI colors
          popper: {
            sx: {
              "& .MuiPaper-root": {
                backgroundColor: theme.palette.background.surface,
                color: theme.palette.text.primary,
              },
              "& .MuiPickersDay-root:not(.Mui-selected)": {
                borderColor: "transparent",
              },
              // "& .MuiDayCalendar-weekDayLabel": {
              //   color: theme.palette.primary[500],
              // },
              "& .MuiPickersDay-today:not(.Mui-selected)": {
                borderColor: theme.palette.primary[500],
                color: theme.palette.primary[500],
              },
            },
          },
        }}
      />
    );
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(true);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/users/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "*/*"
          }
        });
        const result = await res.json();
        const data = result.data || {};
        setUsername(data.fullName || "");
        setMobile(data.phone || "");
        setEmail(data.email || "");
        setAvatar(data.imageUrl || defaultImage);
        setCityId(data.cityId || "");
        setLatitude(data.latitude || "");
        setLongitude(data.longitude || "");
        setUserId(data.id);
        setLoadingProfile(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoadingProfile(false);
      }
    }
    async function loadCities() {
      try {
        const res = await fetch("http://localhost:8080/api/cities/all");
        const result = await res.json();
        setCities(result.data || []);
      } catch (err) {
        // Optionally handle error
      }
    }
    loadProfile();
    loadCities();
  }, []);

  return (
    <Box
      sx={{ p: 2, borderRadius: "md", height: "100%" }}
      width={"100%"}
      className="boxShadow"
    >
      <Box
        width={"100%"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.primary[500],
            fontSize: "xl",
          }}
        >
          {t("Edit-Your-Profile")}
        </Typography>
        <DeleteAccountModal />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          gap: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mb: 0,
            width: "100%",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Click to see in full screen" arrow>
              <Avatar
                component={"div"}
                src={avatar}
                srcSet={avatar}
                alt={defaultImage}
                sx={{
                  width: 200,
                  height: 200,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    "& img": {
                      transform: "scale(1.1)",
                    },
                  },
                  "& img": {
                    transition: "transform 0.3s ease",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                }} // Change cursor to pointer for better UX
                onClick={() => {
                  openLightbox([
                    {
                      src: avatar,
                      alt: userData.username,
                      title: userData.username,
                    },
                  ]);
                }}
              />
            </Tooltip>

            <IconButton
              sx={{
                position: "absolute",
                width: 50,
                height: 50,
                bottom: 0,
                right: 0,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary[100],
                "&:hover": { backgroundColor: theme.palette.primary[200] },
              }}
              onClick={() => document.getElementById("avatar-input").click()}
            >
              <RiPencilFill size={28} />
            </IconButton>
            <Input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              sx={{ display: "none" }}
            />
          </Box>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid xs={12}>
            <FormControl>
              <FormLabel>{t("Username")}</FormLabel>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>{t("email")}</FormLabel>
              <Input
                placeholder="xyz@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                disabled={userData?.type === "google"}
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>{t("mobile")}</FormLabel>
              <PhoneInput
                inputClass="generalClass"
                placeholder={t("enter-phone-number")}
                value={mobile}
                disabled={userData?.type !== "google"}
                inputStyle={{
                  width: "100%",
                  height: "45px",
                  backgroundColor: theme.palette.background.surface,
                }}
                onChange={(value, data) => setMobile(value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Autocomplete
                options={cities}
                getOptionLabel={option => option.name || ""}
                value={cities.find(c => c.id === Number(cityId)) || null}
                onChange={(_, value) => setCityId(value ? value.id : "")}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={params => (
                  <Input {...params} placeholder="Select city" variant="outlined" size="lg" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Latitude</FormLabel>
              <Input
                placeholder="Enter latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Longitude</FormLabel>
              <Input
                placeholder="Enter longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                fullWidth
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: "100%",
          justifyContent: "end",
          display: "flex",
          marginTop: 4,
        }}
      >
        <Button sx={{ width: "150px" }} onClick={handleSave} disabled={loading}>
          {loading ? t("loading") : t("update-user")}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileView;
