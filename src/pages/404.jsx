import { Grid, Typography } from "@mui/joy";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();
  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image
        width={400}
        height={380}
        src="/assets/images/not-found.gif"
        alt="notfound"
      />
      <Typography variant="h6" component="h5" level="body-lg" fontSize={20}>
        {t("Nothing Here Yet")}
      </Typography>
    </Grid>
  );
}

export default NotFound;
