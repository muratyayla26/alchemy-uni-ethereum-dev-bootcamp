import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { alchemy } from "./alchemy";
import { Utils } from "alchemy-sdk";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const TransactionDetailModal = ({
  currentTransaction,
  txnDetailModalOpen,
  setTxnDetailModalOpen,
}) => {
  const [txnDetail, setTxnDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { status, blockNumber, from, to, effectiveGasPrice, gasUsed } =
    txnDetail;

  const gasPriceEth = Utils.formatEther(effectiveGasPrice?._hex || 0);
  const gasPriceGwei = Utils.formatUnits(effectiveGasPrice?._hex || 0, "gwei");
  const gasPriceWei = Utils.formatUnits(effectiveGasPrice?._hex || 0, "wei");
  const transactionFee = Utils.formatEther(
    gasPriceWei * parseInt(gasUsed?._hex) || 0
  );

  const handleClose = () => {
    setTxnDetailModalOpen(false);
  };

  useEffect(() => {
    const getTxnDetail = async () => {
      try {
        setIsLoading(true);

        const response = await alchemy.core.getTransactionReceipt(
          currentTransaction
        );
        setTxnDetail(response);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentTransaction) {
      getTxnDetail();
    }
  }, [currentTransaction]);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        open={txnDetailModalOpen}
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="body2">{currentTransaction}</Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {isLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "202px" }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ mr: 2, height: "fit-content" }}
            >
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <b>Status:</b>
                    </TableCell>
                    <TableCell align="left">
                      {status === 1 ? (
                        <Chip size="small" color="success" label="Success" />
                      ) : (
                        <Chip size="small" color="error" label="Failure" />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Block:</b>
                    </TableCell>
                    <TableCell align="left">{blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>From:</b>
                    </TableCell>
                    <TableCell align="left">{from}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>To:</b>
                    </TableCell>
                    <TableCell align="left">{to}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Gas Price:</b>
                    </TableCell>
                    <TableCell align="left">{`${gasPriceEth} ETH (${gasPriceGwei} Gwei)`}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Transaction Fee:</b>
                    </TableCell>
                    <TableCell align="left">{`${transactionFee} ETH`}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default TransactionDetailModal;
