import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Avatar,
  Input,
  Button,
  Stack,
  FormControl,
  FormLabel,
  IconButton,
  useTheme,
} from "@mui/joy";
import { RiPencilFill } from "@remixicon/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useTranslation } from "react-i18next";
import { updateUserSettings } from "@/events/actions";
import toast from "react-hot-toast";
import Autocomplete from "@mui/joy/Autocomplete";

const ProfileModal = ({ open, setOpen }) => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [langKey, setLangKey] = useState("");
  const [cityId, setCityId] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [cities, setCities] = useState([]);
  const [langOptions] = useState(["en", "vi"]);
  const theme = useTheme();
  const { t } = useTranslation();
  const defaultImage = "https://ui-avatars.com/api/?background=random";
  const countryCode = process.env.NEXT_PUBLIC_COUNTRY_CODE || "us";

  async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/users/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "*/*"
      }
    });
    const data = await res.json();
    console.log(data);
    if (data && data.data) {
      setUserData(data.data);
      console.log(data.data.fullName);
      setUsername(data.data.fullName || "");
      setMobile(data.data.phone || "");
      setEmail(data.data.email || "");
      setPreviewImage(data.data.imageUrl || "");
      setLangKey(data.data.langKey || "");
      setCityId(data.data.cityId || "");
      setReferralCode(data.data.referralCode || "");
      setLatitude(data.data.latitude || "");
      setLongitude(data.data.longitude || "");
      setActivated(!!data.data.activated);
    }
  }

  useEffect(() => {
    if (open) {
      fetchUserProfile();
      fetch("http://localhost:8080/api/cities/all")
        .then(res => res.json())
        .then(data => {
          if (data && data.data) setCities(data.data);
        });
    }
  }, [open]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    if (!userData?.id) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: username,
          phone: mobile,
          cityId: cityId ? Number(cityId) : undefined,
          langKey,
          activated,
        })
      });
      const data = await res.json();
      if (data && data.code === 200) {
        toast.success("Profile updated successfully");
        await fetchUserProfile();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: theme.palette.background.body,
          borderRadius: "md",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Avatar and Username */}
        <Stack alignItems="center" spacing={2} sx={{ position: "relative" }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={previewImage || defaultImage}
              alt={username || "User"}
              sx={{ width: 100, height: 100 }}
            />
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary[100],
                "&:hover": { backgroundColor: theme.palette.primary[200] },
              }}
              onClick={() => document.getElementById("avatar-input").click()}
            >
              <RiPencilFill color={theme.palette.common.black} />
            </IconButton>
            <Input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ display: "none" }}
            />
          </Box>
          <Typography fontSize="lg" fontWeight="bold">
            {username || "User"}
          </Typography>
        </Stack>

        {/* Email and Mobile Fields */}
        <Box sx={{ mt: 2, width: "100%" }}>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>{t("Full Name")}</FormLabel>
            <Input fullWidth value={username} onChange={e => setUsername(e.target.value)} />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>{t("Phone")}</FormLabel>
            <Input fullWidth value={mobile} onChange={e => setMobile(e.target.value)} />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>{t("City")}</FormLabel>
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
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>{t("Language Key")}</FormLabel>
            <Autocomplete
              options={langOptions}
              getOptionLabel={option => option}
              value={langKey}
              onChange={(_, value) => setLangKey(value || "")}
              renderInput={params => (
                <Input {...params} placeholder="Select language" variant="outlined" size="lg" />
              )}
            />
          </FormControl>
          <FormControl sx={{ mb: 2, flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <FormLabel>{t("Activated")}</FormLabel>
            <input type="checkbox" checked={activated} onChange={e => setActivated(e.target.checked)} />
          </FormControl>
        </Box>

        {/* Update Button */}
        <Button
          variant="solid"
          color="primary"
          onClick={handleProfileUpdate}
          sx={{ mt: 2 }}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
