"use client";
import { Box, Card } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import * as fbq from "@/lib/fpixel";

const Privacy = () => {
  const data = useSelector((state) => state?.settings?.value);
  const [PrivacyPolicy, setPrivacyPolicy] = useState();

  const { t } = useTranslation();
  useEffect(() => {
    setPrivacyPolicy(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    fbq.customEvent("privacy-policy-page");
  }, []);
  return (
    <>
      <HeadTitle title={"Privacy Policy"} />

      <Box className="title-wrapper"></Box>
      <Card className="privacy-content">
        {PrivacyPolicy && PrivacyPolicy.privacy_policy ? (
          // <Typography
          //   variant="h6"
          //   component="h5"
          //   dangerouslySetInnerHTML={{ __html: data.privacy_policy }}
          // />
          <div
            dangerouslySetInnerHTML={{ __html: PrivacyPolicy.privacy_policy }}
          ></div>
        ) : (
          <Typography variant="body1">{t("loading")}...</Typography>
        )}
      </Card>
    </>
  );
};

export default Privacy;
