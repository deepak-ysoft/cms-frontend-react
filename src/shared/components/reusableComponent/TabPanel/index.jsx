import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, AppBar, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function TabPanelComponent({ tabs, initialActiveTab, onTabChange, width = 1700 }) {
  const theme = useTheme();

  const getInitialIndex = () => {
    const index = tabs.findIndex((tab) => tab.label === initialActiveTab);
    return index !== -1 ? index : 0;
  };

  const [value, setValue] = useState(getInitialIndex);

  useEffect(() => {
    const newIndex = tabs.findIndex((tab) => tab.label === initialActiveTab);
    if (newIndex !== -1) setValue(newIndex);
  }, [initialActiveTab, tabs]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onTabChange) onTabChange(tabs[newValue].label);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </AppBar>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          hidden={value !== index}
          id={`full-width-tabpanel-${index}`}
          aria-labelledby={`full-width-tab-${index}`}
        >
          {value === index && <Box sx={{ p: 3 }}>{tab.content}</Box>}
        </div>
      ))}
    </Box>
  );
}

TabPanelComponent.propTypes = {
  tabs: PropTypes.array.isRequired,
  initialActiveTab: PropTypes.string,
  onTabChange: PropTypes.func,
  width: PropTypes.number,
};

export default TabPanelComponent;
