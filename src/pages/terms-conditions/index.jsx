"use client";
import { Box, Card } from "@mui/joy";
import React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import * as fbq from "@/lib/fpixel";

const TermsConditions = () => {
  const data = useSelector((state) => state?.settings?.value);
  const [termsAndConditions, setTermsAndConditions] = useState();

  const { t } = useTranslation();
  useEffect(() => {
    setTermsAndConditions(data);
  }, [data]);

  useEffect(() => {
    fbq.customEvent("terms-and-condition-page");
  }, []);

  return (
    <>
      <HeadTitle title={"Terms & Conditions"} />

      <Card className="termsconditions-content">
        {/* in the Typography dangorous api will  */}
        {termsAndConditions && termsAndConditions.terms_conditions ? (
          <div
            dangerouslySetInnerHTML={{
              __html: termsAndConditions?.terms_conditions,
            }}
          ></div>
        ) : (
          <Typography variant="body1">{t("loading")}...</Typography>
        )}
      </Card>
    </>
  );
};

export default TermsConditions;
