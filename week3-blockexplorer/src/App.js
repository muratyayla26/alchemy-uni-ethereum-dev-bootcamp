import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CurrentBlock from "./CurrentBlock";
import AddressInfos from "./AddressInfos";
import "./App.css";

function App() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container sx={{ width: "100%", py: 2 }}>
      <Typography sx={{ mb: 2, textAlign: "center" }} variant="h4">
        Block Explorer
      </Typography>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange}>
            <Tab label="Latest Block" value="1" />
            <Tab label="Get Address Infos" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <CurrentBlock />
        </TabPanel>
        <TabPanel value="2">
          <AddressInfos />
        </TabPanel>
      </TabContext>
    </Container>
  );
}

export default App;

