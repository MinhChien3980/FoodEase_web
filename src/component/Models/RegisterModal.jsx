"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Stack,
  FormControl,
  FormLabel,
  Input,
  ModalClose,
} from "@mui/joy";
import { login, register } from "@/events/actions";
import toast from "react-hot-toast";
import { onLoggedIn } from "@/events/events";
import { useTranslation } from "react-i18next";
import { registerUser } from "@/interceptor/api";
import Autocomplete from "@mui/joy/Autocomplete";

const RegisterModal = ({
  openRegisterModal,
  setOpenRegisterModal,
  setLoginModalOpen,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(openRegisterModal);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setOpen(openRegisterModal);
    // Fetch cities when modal opens
    if (openRegisterModal) {
      fetch("http://localhost:8080/api/cities/all")
        .then(res => res.json())
        .then(data => {
          if (data && data.data) setCities(data.data);
        });
    }
  }, [openRegisterModal]);

  const [prefill, setPrefill] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    cityId: 1,
    langKey: "en",
  });

  const addValueProps = (name) => ({
    value: prefill[name] || "",
    onChange: (e) => {
      setPrefill({ ...prefill, [name]: e.target.value });
    },
  });

  const handleRegister = async () => {
    if (prefill.password !== prefill.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { confirmPassword, ...apiData } = prefill;
    const res = await registerUser(apiData);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message || "Registration successful");
      setOpenRegisterModal(false);
      setLoginModalOpen(false);
      setOpen(false);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setOpenRegisterModal(false);
        }}
        sx={{ width: "100%", height: "100%" }}
      >
        <ModalDialog
          size="md"
          sx={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <ModalClose />
          <DialogTitle>{t("Register-Taste-Enjoy")}</DialogTitle>
          <DialogContent
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {t(
              "Start-your-culinary-journey-with-a-simple-registration-process.-Sign-up-today-to-explore-a-world-of-flavors-delivered-to-you-with-ease."
            )}
          </DialogContent>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>{t("Full Name")}</FormLabel>
              <Input size="lg" placeholder="Your name" variant="outlined" {...addValueProps("fullName")} />
            </FormControl>
            <FormControl>
              <FormLabel>{t("Email")}</FormLabel>
              <Input size="lg" type="email" placeholder="Email" variant="outlined" {...addValueProps("email")} />
            </FormControl>
            <FormControl>
              <FormLabel>{t("Password")}</FormLabel>
              <Input size="lg" type="password" placeholder="Password" variant="outlined" {...addValueProps("password")} />
            </FormControl>
            <FormControl>
              <FormLabel>{t("Confirm Password")}</FormLabel>
              <Input size="lg" type="password" placeholder="Confirm Password" variant="outlined" {...addValueProps("confirmPassword")} />
            </FormControl>
            <FormControl>
              <FormLabel>{t("Phone Number")}</FormLabel>
              <Input size="lg" placeholder="Phone" variant="outlined" {...addValueProps("phone")} />
            </FormControl>
            <FormControl>
              <FormLabel>{t("City")}</FormLabel>
              <Autocomplete
                options={cities}
                getOptionLabel={option => option.name || ""}
                value={cities.find(c => c.id === prefill.cityId) || null}
                onChange={(_, value) => setPrefill({ ...prefill, cityId: value ? value.id : "" })}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={params => (
                  <Input {...params} placeholder="Select city" variant="outlined" size="lg" />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t("Language Key")}</FormLabel>
              <Input size="lg" placeholder="Language Key (e.g. en, vi)" variant="outlined" {...addValueProps("langKey")} />
            </FormControl>
            <Button onClick={handleRegister}>{t("submit")}</Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default RegisterModal;
