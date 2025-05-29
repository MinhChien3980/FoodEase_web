import React, { useEffect, useState } from "react";
import WalletTransactionsView from "@/views/WalletTransactionView";
import WalletComponent from "@/component/Wallet/WalletComponent";
import { transactions } from "@/interceptor/api";

import { Box } from "@mui/joy";
import { updateUserSettings } from "@/events/actions";

const WalletPageView = () => {
  const [transactions1, setTransactions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(null);
  const [apiError, setApiError] = useState(false);
  useEffect(() => {
    updateUserSettings();
  }, []);
  const transactionsData = async () => {
    setApiError(false);
    setLoader(true);
    try {
      const response = await transactions({
        limit: limit,
        offset: offset,
        search: search,
        transaction_type: "wallet",
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
  return (
    <Box
      width={"100%"}
      gap={2}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <WalletComponent transactionsData={transactionsData} />
      <WalletTransactionsView
        transactionsData={transactionsData}
        transactions1={transactions1}
        setTransactions={setTransactions}
        loader={loader}
        setLoader={setLoader}
        total={total}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
        apiError={apiError}
      />
    </Box>
  );
};

export default WalletPageView;
