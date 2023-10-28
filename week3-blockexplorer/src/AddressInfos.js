import { useState } from "react";
import { alchemy } from "./alchemy";
import { Utils } from "alchemy-sdk";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

const AddressInfos = () => {
  const [tabValue, setTabValue] = useState("1");
  const [isLoading, setIsLoading] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [balanceData, setBalanceData] = useState();
  const [sentTransactionsData, setSentTransactionsData] = useState([]);
  const [receivedTransactionsData, setReceivedTransactionsData] = useState([]);

  const handleSearch = async () => {
    try {
      setIsLoading("loading");

      const [balance, sentHistory, receivedHistory] = await Promise.all([
        alchemy.core.getBalance(addressQuery),
        alchemy.core.getAssetTransfers({
          fromAddress: addressQuery,
          category: ["external"],
        }),
        alchemy.core.getAssetTransfers({
          toAddress: addressQuery,
          category: ["external"],
        }),
      ]);
      const balanceEth = Utils.formatEther(balance?._hex || 0);
      setBalanceData(balanceEth);
      setSentTransactionsData(sentHistory.transfers || []);
      setReceivedTransactionsData(receivedHistory.transfers || []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading("received");
    }
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const TxnTable = () => {
    const data =
      tabValue === "1" ? sentTransactionsData : receivedTransactionsData;
    return (
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Hash</b>
              </TableCell>
              <TableCell>
                <b>Value</b>
              </TableCell>
              <TableCell>
                <b>{tabValue === "1" ? "To" : "From"}</b>
              </TableCell>
              <TableCell>
                <b>Block Number</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ hash, value, to, from, blockNum }) => (
              <TableRow key={hash}>
                <TableCell>{hash}</TableCell>
                <TableCell>{value}</TableCell>
                <TableCell>{tabValue === "1" ? to : from}</TableCell>
                <TableCell>{parseInt(blockNum)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Stack width="100%" alignItems="center">
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "650px" }}
      >
        <TextField
          size="small"
          label="The address or ENS name of the account"
          value={addressQuery}
          onChange={(event) => {
            setAddressQuery(event.target.value);
          }}
          sx={{ width: "100%", mr: 1 }}
        />
        <Button
          disabled={isLoading === "loading"}
          variant="contained"
          onClick={handleSearch}
        >
          SEARCH
        </Button>
      </Stack>
      {isLoading === "received" ? (
        <Stack alignItems="flex-start" width="100%" sx={{ mt: 2 }}>
          <Typography>
            <b>ETH Balance:</b> {balanceData}
          </Typography>
          <TabContext value={tabValue}>
            <Box sx={{ width: "100%" }}>
              <TabList onChange={handleTabChange}>
                <Tab label="Sent Transactions" value="1" />
                <Tab label="Received Transactions" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ width: "100%" }}>
              <TxnTable />
            </TabPanel>
            <TabPanel value="2" sx={{ width: "100%" }}>
              <TxnTable />
            </TabPanel>
          </TabContext>
        </Stack>
      ) : null}
      {isLoading === "loading" ? (
        <Stack sx={{ width: "100%", mt: 3 }} alignItems="center">
          <CircularProgress />
        </Stack>
      ) : null}
    </Stack>
  );
};
export default AddressInfos;
