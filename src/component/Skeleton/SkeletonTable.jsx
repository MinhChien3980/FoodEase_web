// SkeletonTable.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.vars.palette.primary[500],
  color: theme.vars.palette.primary[50],
  padding: theme.spacing(1),
  fontWeight: 800,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const SkeletonTable = () => {
  const { t } = useTranslation();

  return (
    <TableContainer
      className="boxShadow"
      sx={{ borderRadius: "10px", width: "100%" }}
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
          {[...Array(5)].map((_, index) => (
            <StyledTableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="100%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="100%" />
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SkeletonTable;
