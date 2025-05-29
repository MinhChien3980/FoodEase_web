import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Textarea,
  Typography,
  useTheme,
} from "@mui/joy";
import { RiStickyNoteAddLine } from "@remixicon/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AddNote = () => {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const { t } = useTranslation();
  localStorage.setItem("orderNote", message);

  return (
    <Grid xs={12} width={"100%"}>
      <Box
        sx={{
          borderRadius: "sm",
          backgroundColor: theme.palette.background.surface,
        }}
        className="boxShadow"
        p={2}
      >
        <CardActions
          orientation="horizontal"
          sx={{
            pt: 0,
            pb: 0,
            px: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            gap={1}
          >
            <RiStickyNoteAddLine
              color={
                theme.palette.mode === "light"
                  ? theme.palette.text.menuText
                  : theme.palette.text.currency
              }
            />
            <Typography
              textColor={
                theme.palette.mode === "light"
                  ? "text.menuText"
                  : "text.secondary"
              }
              sx={{ fontSize: { xs: "sm", md: "md" } }}
              fontWeight={"lg"}
            >
              {t("Add-Notes-For-Restaurants")}
            </Typography>
          </Box>
        </CardActions>

        <CardContent orientation="vertical" sx={{ px: { md: 4, xs: 2 } }}>
          <Divider sx={{ my: 1, width: "100%" }} />
          <Box>
            <Textarea
              sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
              variant="soft"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("Add-Notes-For-Restaurants")}
              minRows={4}
            />
          </Box>
        </CardContent>
      </Box>
    </Grid>
  );
};

export default AddNote;
