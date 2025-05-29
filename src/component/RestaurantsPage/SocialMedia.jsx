import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { SocialIcon } from "react-social-icons";
import { Box, Modal, Typography, IconButton, Input } from "@mui/joy";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/joy";
import { RiCloseLine, RiFileCopy2Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const socialLinks = [
  { name: "Twitter", url: "https://twitter.com" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "Instagram", url: "https://instagram.com" },
  { name: "Telegram", url: "https://telegram.me" },
  { name: "Email", url: "https://mail.google.com/" },
  { name: "WhatsApp", url: "https://whatsapp.com" },
];

const SocialMedia = () => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState(window.location.href);
  const theme = useTheme();

  const { t } = useTranslation();

  const handleIconClick = (name) => {
    if (name === "Copy Link") {
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, cursor: "pointer" }}>
        <SocialIcon
          className="social-icon-share"
          network=""
          onClick={() => setOpen((prev) => !prev)}
        />
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ border: "none", padding: 0 }}
      >
        <Box>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "none",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: theme.palette.background.surface,
              minWidth: "300px",
              borderRadius: "md",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ color: theme.palette.text.primary }}
              >
                {t("Share")}
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <RiCloseLine />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }} mb={1}>
              {socialLinks.map((link, index) => (
                <SocialIcon
                  key={index}
                  url={link.url}
                  network={link.network}
                  target={link.url ? "_blank" : undefined}
                  onClick={() => handleIconClick(link.name)}
                  className="social-icon cursor"
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Input
                value={link}
                readOnly
                fullWidth
                sx={{
                  flex: 1,
                  px: 2,
                  backgroundColor: theme.palette.danger.outlinedDisabledBorder,
                }}
                endDecorator={
                  <IconButton onClick={() => handleIconClick("Copy Link")}>
                    <RiFileCopy2Line />
                  </IconButton>
                }
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SocialMedia;
