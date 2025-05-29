import { Grid, Typography } from "@mui/joy";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image
        width={300}
        height={300}
        src="/assets/images/not-found.gif"
        alt="notfound"
      />
      <Typography variant="h6" component="h5" level="body-lg">
        {t("nothing-here-yet")}
      </Typography>
    </Grid>
  );
};

export default NotFound;
