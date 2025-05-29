import React, { useState, useEffect } from "react";
import { transactions } from "@/interceptor/api";
import { Box, Card, Chip, Divider, useTheme } from "@mui/joy";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { styled } from "@mui/system";
import SkeletonTable from "@/component/Skeleton/SkeletonTable";
import NotFound from "@/pages/NotFound";
import toast from "react-hot-toast";
import { capitalizeFirstLetter, formatePrice } from "@/helpers/functionHelpers";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.vars.palette.primary[500],
  color: theme.vars.palette.primary[50],
  padding: theme.spacing(1),
  fontWeight: 800,
  whiteSpace: "nowrap", // Ensure text does not wrap
  overflow: "hidden", // Hide overflow text
  textOverflow: "ellipsis", // Show ellipsis for overflow text
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
    borderBottom: 1,
  },
}));

const TransactionsView = () => {
  const [transactions1, setTransactions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(null);
  const [apiError, setApiError] = useState(false);
  const theme = useTheme();
  const settings = useSelector((state) => state.settings.value);
  const { t } = useTranslation();
  const isRtl = useSelector((state) => state.rtl.layoutDirection);

  const transactionsData = async () => {
    setApiError(false);
    setLoader(true);
    try {
      const response = await transactions({
        limit: limit,
        offset: offset,
        search: search,
        transaction_type: "transaction",
      });
      setLoader(false);
      if (!response.error) {
        setTotal(response.total);
        setTransactions(response.data);
      }
    } catch (error) {
      setLoader(false);
      setApiError(true);
    }
  };

  useEffect(() => {
    transactionsData();
  }, [limit, offset]);

  const handlePageChange = (event, page) => {
    setOffset((page - 1) * limit);
  };

  return (
    <Box width={"100%"}>
      {loader ? (
        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SkeletonTable />
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            padding: 0,
            width: "100%",
            borderRadius: "md",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!apiError ? (
            transactions1 && transactions1.length > 0 ? (
              <>
                <TableContainer
                  className="boxShadow"
                  sx={{ borderRadius: "10px" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>{t("amount")}</StyledTableCell>
                        <StyledTableCell>{t("order_id")}</StyledTableCell>
                        <StyledTableCell>{t("Type")}</StyledTableCell>
                        <StyledTableCell>{t("Transaction-ID")}</StyledTableCell>
                        <StyledTableCell>{t("message")}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions1.map((transaction, index) => (
                        <StyledTableRow key={index}>
                          <TableCell
                            sx={{
                              color: theme.palette.text.currency,
                              whiteSpace: "nowrap", // Ensure text does not wrap
                              overflow: "hidden", // Hide overflow text
                              textOverflow: "ellipsis", // Show ellipsis for overflow text
                              minWidth: "120px", // Set a minimum width
                            }}
                          >
                            {formatePrice(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <span
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  transaction.order_id
                                );
                                toast.success("copy to clipboard");
                              }}
                              className="cursor"
                            >
                              {transaction.order_id}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Chip variant="soft">
                              {capitalizeFirstLetter(transaction.type)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <span
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  transaction.txn_id
                                );
                                toast.success("copy to clipboard");
                              }}
                              className="cursor"
                            >
                              {transaction.txn_id}
                            </span>
                          </TableCell>
                          <TableCell>
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
                  mt={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    overflowX: "auto",
                    flexWrap: "nowrap",
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
              <NotFound />
            )
          ) : (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>Error</p>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TransactionsView;
