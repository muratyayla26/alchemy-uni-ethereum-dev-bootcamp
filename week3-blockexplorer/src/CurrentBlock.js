import { useEffect, useState } from "react";
import { alchemy } from "./alchemy";
import { Utils } from "alchemy-sdk";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
import TransactionDetailModal from "./TransactionDetailModal";
import TableHead from "@mui/material/TableHead";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const CurrenBlock = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blockData, setBlockData] = useState({});
  const [currentTransaction, setCurrentTransaction] = useState("");
  const [txnDetailModalOpen, setTxnDetailModalOpen] = useState(false);
  const {
    number,
    timestamp,
    miner,
    gasLimit,
    gasUsed,
    baseFeePerGas,
    transactions,
  } = blockData;

  useEffect(() => {
    const getBlock = async () => {
      try {
        setIsLoading(true);

        const response = await alchemy.core.getBlock("latest");
        setBlockData(response);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    getBlock();
  }, []);

  if (isLoading) {
    return (
      <Stack width="100%" alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  const blockTimestamp = dayjs.unix(timestamp);
  const currentTime = dayjs();

  const gasLimitNum = parseInt(gasLimit?._hex);
  const gasUsedNum = parseInt(gasUsed?._hex);
  const gasUsedPercent = ((gasUsedNum / gasLimitNum) * 100).toFixed(2);

  const baseFeePerGasEth = Utils.formatEther(baseFeePerGas?._hex || 0);
  const baseFeePerGasGwei = Utils.formatUnits(baseFeePerGas?._hex || 0, "gwei");

  const handleOpenTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setTxnDetailModalOpen(true);
  };

  return (
    <Stack flexDirection="row">
      <TableContainer component={Paper} sx={{ mr: 2, height: "fit-content" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Block Number:</b>
              </TableCell>
              <TableCell align="left">{number}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Timestamp:</b>
              </TableCell>
              <TableCell align="left">
                {`${currentTime.diff(blockTimestamp, "second")} seconds ago`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Miner:</b>
              </TableCell>
              <TableCell align="left">{miner}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Gas Limit:</b>
              </TableCell>
              <TableCell align="left">{gasLimitNum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Gas Used:</b>
              </TableCell>
              <TableCell align="left">{`${gasUsedNum} (${gasUsedPercent}%)`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Base Fee Per Gas:</b>
              </TableCell>
              <TableCell align="left">{`${baseFeePerGasEth} ETH (${baseFeePerGasGwei} Gwei)`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper} sx={{ maxHeight: "530px" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>
                <b>Block's Transactions ({transactions.length})</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction}>
                <TableCell sx={{ textAlign: "center" }}>
                  <Chip
                    onClick={() => handleOpenTransaction(transaction)}
                    sx={{
                      width: "100%",
                      cursor: "pointer",
                    }}
                    label={transaction}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TransactionDetailModal
        currentTransaction={currentTransaction}
        txnDetailModalOpen={txnDetailModalOpen}
        setTxnDetailModalOpen={setTxnDetailModalOpen}
      />
    </Stack>
  );
};
export default CurrenBlock;
