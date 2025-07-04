import { useState, useContext, type ReactNode } from "react";
import {
  useTranslate,
  useGetIdentity,
  useGetLocale,
  useSetLocale,
} from "@refinedev/core";
import {
  type RefineThemedLayoutV2HeaderProps,
  HamburgerMenu,
} from "@refinedev/mui";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import i18n from "../../i18n";
import type { IIdentity } from "../../interfaces";
import { ColorModeContext } from "../../contexts";

interface IOptions {
  label: string;
  avatar?: ReactNode;
  link: string;
  category: string;
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const t = useTranslate();
  const { mode, setMode } = useContext(ColorModeContext);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<IOptions[]>([]);

  const changeLanguage = useSetLocale();
  const locale = useGetLocale();
  const currentLocale = locale();
  const { data: user } = useGetIdentity<IIdentity | null>();

  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={0}
      sx={{
        "& .MuiToolbar-root": {
          minHeight: "64px",
        },
        height: "64px",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Toolbar
        sx={{
          paddingLeft: {
            xs: "0",
            sm: "16px",
            md: "24px",
          },
        }}
      >
        <Box
          minWidth="40px"
          minHeight="40px"
          marginRight={{
            xs: "0",
            sm: "16px",
          }}
          sx={{
            "& .MuiButtonBase-root": {
              marginLeft: 0,
              marginRight: 0,
            },
          }}
        >
          <HamburgerMenu />
        </Box>

        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          gap={{
            xs: "8px",
            sm: "24px",
          }}
        >
          <Stack direction="row" flex={1}>
            <Autocomplete
              sx={{
                maxWidth: 550,
              }}
              id="search-autocomplete"
              options={options}
              filterOptions={(x) => x}
              disableClearable
              freeSolo
              fullWidth
              size="small"
              onInputChange={(event, value) => {
                if (event?.type === "change") {
                  setValue(value);
                }
              }}
              groupBy={(option) => option.category}
              renderOption={(props, option: IOptions) => {
                return (
                  <Link href={option.link} underline="none">
                    <Box
                      {...props}
                      component="li"
                      sx={{
                        display: "flex",
                        padding: "10px",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {option?.avatar && option.avatar}
                      <Typography
                        sx={{
                          fontSize: {
                            md: "14px",
                            lg: "16px",
                          },
                        }}
                      >
                        {option.label}
                      </Typography>
                    </Box>
                  </Link>
                );
              }}
              renderInput={(params) => {
                return (
                  <Box
                    position="relative"
                    sx={{
                      "& .MuiFormLabel-root": {
                        paddingRight: "24px",
                      },
                      display: {
                        xs: "none",
                        sm: "block",
                      },
                    }}
                  >
                    <TextField
                      {...params}
                      label={t("search.placeholder")}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                        },
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <SearchOutlined />
                    </IconButton>
                  </Box>
                );
              }}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: "8px",
              sm: "24px",
            }}
          >
            <Select
              size="small"
              value={currentLocale}
              slotProps={{
                input: {
                  "aria-label": "Without label",
                },
              }}
              variant="outlined"
              sx={{
                width: {
                  xs: "120px",
                  sm: "160px",
                },
              }}
            >
              <MenuItem
                selected={currentLocale === "en"}
                value="en"
                onClick={() => {
                  changeLanguage("en");
                }}
              >
                <Typography color="text.secondary">
                  English
                </Typography>
              </MenuItem>
              <MenuItem
                selected={currentLocale === "vi"}
                value="vi"
                onClick={() => {
                  changeLanguage("vi");
                }}
              >
                <Typography color="text.secondary">
                  Tiếng Việt
                </Typography>
              </MenuItem>
            </Select>

            <IconButton
              onClick={() => {
                setMode();
              }}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "transparent" : "#00000014",
              }}
            >
              {mode === "dark" ? (
                <BrightnessHighIcon />
              ) : (
                <Brightness4Icon
                  sx={{
                    fill: "#000000DE",
                  }}
                />
              )}
            </IconButton>

            <Stack
              direction="row"
              gap={{
                xs: "8px",
                sm: "16px",
              }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                fontSize={{
                  xs: "12px",
                  sm: "14px",
                }}
                variant="subtitle2"
              >
                {user?.name}
              </Typography>
              <Avatar src={user?.avatar} alt={user?.name} />
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
