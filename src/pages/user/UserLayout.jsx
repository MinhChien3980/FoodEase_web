import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Avatar,
  CircularProgress,
} from "@mui/joy";
import { useSelector } from "react-redux";
import { RiPhoneFill, RiMailFill, RiEditBoxFill } from "@remixicon/react";
import ProfileTabs from "@/component/Profile/ProfileTabs";
import { isLogged } from "@/events/getters";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import ProfileNavigation from "@/component/Profile/ProfileNavigation";
import openLightbox from "@/component/ImageBox/ImageLightbox";

const UserLayout = ({ children }) => {
  const profile = useSelector((state) => state.userSettings.value);
  const isDark = useSelector((state) => state.darkMode.value);

  const username = profile?.username;
  const mobile = profile?.mobile;
  const email = profile?.email;
  const theme = useTheme();
  const defaultImage = "https://ui-avatars.com/api/?background=random";
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useLayoutEffect(() => {
    setLoading(true);
    if (!isLogged()) {
      router.push("/home");
      toast.error("Please Login!!!");
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line
  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            height: "100vh !important",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          width={"100%"}
          display={"flex"}
          height={"100%"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
          my={2}
          spacing={{ xs: 0, lg: 4 }}
        >
          <Grid
            xs={12}
            md={4}
            lg={3}
            sx={{ display: { xs: "none", lg: "block" } }}
          >
            <Box
              sx={{
                borderRadius: "xl",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                pt={4}
                sx={{
                  backgroundColor:
                    isDark == "dark"
                      ? theme.palette.background.backdrop
                      : theme.palette.primary[50],
                  borderRadius: "xl",
                  position: "relative",
                  boxShadow: "lg",
                }}
              >
                <Avatar
                  src={profile.user_profile}
                  srcSet={profile.user_profile}
                  alt={defaultImage}
                  onClick={() => {
                    openLightbox([
                      {
                        src: profile.user_profile,
                        alt: profile.username,
                        title: profile.username,
                      },
                    ]);
                  }}
                  sx={{
                    height: "64px",
                    width: "64px",
                    borderRadius: "50%",
                    position: "absolute",
                    top: 8,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.08)",
                      cursor: "pointer",
                    },
                  }}
                />
                <Link href={"../user/profile" || "#"}>
                  <Box
                    borderRadius={"50%"}
                    display={"flex"}
                    p={1}
                    alignItems={"center"}
                    justifyContent={"center"}
                    bgcolor={theme.palette.primary[100]}
                    sx={{ position: "absolute", top: "8px", right: "8px" }}
                  >
                    <RiEditBoxFill color={theme.palette.common.black} />
                  </Box>
                </Link>
                <Box
                  pt={5}
                  pb={1.5}
                  borderRadius={"xl"}
                  width={"100%"}
                  sx={{ backgroundColor: theme.palette.background.surface }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    width={"100%"}
                  >
                    <Typography
                      fontWeight="lg"
                      fontSize="xl"
                      display={"flex"}
                      flexDirection={"column"}
                      gap={2}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {username}
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      flexDirection: {
                        xs: "column",
                        lg: "column",
                      },
                    }}
                    px={2}
                  >
                    <Typography
                      mt={0.5}
                      fontWeight="md"
                      textAlign={"center"}
                      sx={{
                        color: theme.palette.text.primary,
                        display: mobile == "" ? "none" : "block",
                      }}
                      startDecorator={<RiPhoneFill size={16} />}
                    >
                      {mobile}
                    </Typography>
                    {email && (
                      <>
                        <Typography
                          startDecorator={<RiMailFill size={16} />}
                          ml={1}
                          mt={0.5}
                          fontWeight="md"
                          textAlign={"revert"}
                          sx={{
                            color: theme.palette.text.primary,
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {email}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
              >
                <ProfileTabs />
              </Box>
            </Box>
          </Grid>

          <Grid
            xs={12}
            lg={9}
            sx={{
              display: "flex",
              justifyContent: "start",
              width: "100%",
              alignItems: "center",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Box width={"100%"} display={{ xs: "flex", lg: "none" }}>
              <ProfileNavigation />
            </Box>
            <Box width={"100%"}>{children}</Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default UserLayout;
