import React from "react";
import {
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  useTheme,
} from "@mui/joy";
import { useSelector } from "react-redux";
import { Box } from "@mui/joy";
import Highlighter from "react-highlight-words";

const Boxes = () => {
  const theme = useTheme();
  const data = useSelector((state) => state?.settings?.value);

  const web_settings =
    data?.web_settings?.length > 0 ? data?.web_settings[0] : null;

  const policies = web_settings
    ? [
        {
          mode: web_settings?.return_mode,
          title: "Return Policy",
          settingTitle: web_settings?.return_title,
          description: web_settings?.return_description,
        },
        {
          mode: web_settings?.support_mode,
          title: "Support Policy",
          settingTitle: web_settings?.support_title,
          description: web_settings?.support_description,
        },
        {
          mode: web_settings?.safety_security_mode,
          title: "Safety & Security Policy",
          settingTitle: web_settings?.safety_security_title,
          description: web_settings?.safety_security_description,
        },
      ]
    : [];

  return (
    <Box>
      {data?.web_settings?.length > 0 ? (
        <Grid container spacing={3} mb={10}>
          {policies.length > 0 ? (
            policies.map(
              (policy, index) =>
                policy.mode == "1" && (
                  <Grid xs={12} md={4} key={index}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: "sm", width: "100%" }}
                    >
                      <CardContent>
                        <Typography
                          color={theme.palette.text.black}
                          variant="h5"
                          component="h5"
                          fontSize={25}
                        >
                          <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={
                              policy.title.includes("&")
                                ? policy.title
                                    .split(" & ")[0]
                                    .split(" ")
                                    .concat(["&"])
                                    .concat(
                                      policy.title.split(" & ")[1].split(" ")[0]
                                    )
                                : [policy.title.split(" ")[0]]
                            }
                            autoEscape={true}
                            textToHighlight={policy.title}
                            highlightStyle={{
                              color: theme.palette.primary[600],
                              backgroundColor: "transparent",
                            }}
                          />
                        </Typography>

                        <Divider />
                        <Typography
                          variant="h6"
                          component="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          {policy.settingTitle}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {policy.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
            )
          ) : (
            <></>
          )}
        </Grid>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Boxes;
