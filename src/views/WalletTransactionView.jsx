import React, { useState, useEffect } from "react";
import { transactions } from "@/interceptor/api";
import { Box, Chip, Typography, useTheme } from "@mui/joy";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { styled } from "@mui/system";
import SkeletonTable from "@/component/Skeleton/SkeletonTable";
import toast from "react-hot-toast";
import { formatePrice } from "@/helpers/functionHelpers";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary[500],
  color: theme.vars.palette.primary[50],
  padding: theme.spacing(1),
  fontWeight: 800,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
    fontSize: "0.75rem",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.down("sm")]: {
    "& td, & th": {
      padding: theme.spacing(0.5),
      fontSize: "0.75rem",
    },
  },
}));

const WalletTransactionsView = ({
  transactionsData,
  transactions1,
  setTransactions,
  loader,
  setLoader,
  total,
  setTotal,
  limit,
  setLimit,
  offset,
  setOffset,
  apiError,
  setApiError,
}) => {
  const theme = useTheme();
  const settings = useSelector((state) => state.settings.value);
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = (event, page) => {
    setOffset((page - 1) * limit);
  };

  const isRtl = useSelector((state) => state.rtl.layoutDirection);

  return (
    <Box
      sx={{
        overflowX: "auto",
        padding: 0,
        width: "100%",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!apiError ? (
        loader ? (
          <SkeletonTable />
        ) : transactions1 && transactions1.length > 0 ? (
          <>
            <TableContainer
              sx={{ borderRadius: "10px", width: "100%", overflowX: "auto" }}
            >
              <Table sx={{ width: "100%" }}>
                <TableHead sx={{ width: "100%" }}>
                  <TableRow>
                    <StyledTableCell align="center">
                      {t("amount")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t("order_id")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t("Type")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t("Transaction-ID")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t("message")}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions1.map((transaction, index) => (
                    <StyledTableRow key={index}>
                      <TableCell
                        align="center"
                        sx={{
                          color: theme.palette.text.currency,
                        }}
                      >
                        {formatePrice(transaction.amount)}
                      </TableCell>
                      <TableCell align="center">
                        <span
                          onClick={() => {
                            navigator.clipboard.writeText(transaction.order_id);
                            toast.success("copy to clipboard");
                          }}
                          className="cursor"
                        >
                          {transaction.order_id}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          variant="soft"
                          color={
                            transaction.type == "credit" ? "success" : "danger"
                          }
                        >
                          {transaction.type}
                        </Chip>
                      </TableCell>
                      <TableCell align="center">
                        <span
                          onClick={() => {
                            navigator.clipboard.writeText(transaction.txn_id);
                            toast.success("copy to clipboard");
                          }}
                          className="cursor"
                        >
                          {transaction.txn_id}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        {transaction.message === "null" ||
                        transaction.message === null
                          ? "---"
                          : transaction.message}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <Pagination
                count={Math.ceil(total / limit)}
                page={offset / limit + 1}
                onChange={handlePageChange}
                variant="outlined"
                color="standard"
                sx={{
                  p: 1,
                  width: "auto",
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiPagination-ul": {
                    flexDirection: isRtl == "rtl" ? "row-reverse" : "row",
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              padding: 4,
              borderRadius: "10px",
              backgroundColor: theme.palette.background.paper,
            }}
          ></Box>
        )
      ) : (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="error">
            {t("Error")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WalletTransactionsView;
