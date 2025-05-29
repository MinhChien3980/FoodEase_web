"use client";
import { Box, Card } from "@mui/joy";
import React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import * as fbq from "@/lib/fpixel";

const ContactUs = () => {
  const data = useSelector((state) => state?.settings?.value);
  const [ContactUSData, setContactUSData] = useState();

  const { t } = useTranslation();

  useEffect(() => {
    setContactUSData(data);
  }, [data]);
  useEffect(() => {
    fbq.customEvent("contact-us-page");
  }, []);
  return (
    <>
      <HeadTitle title={"Contact Us"} />

      <Card className="contactus-content">
        {/* in the Typography dangorous api will  */}
        {ContactUSData && ContactUSData.contact_us ? (
          <div
            dangerouslySetInnerHTML={{ __html: ContactUSData.contact_us }}
          ></div>
        ) : (
          <Typography variant="body1">{t("loading")}</Typography>
        )}
      </Card>
    </>
  );
};

export default ContactUs;
