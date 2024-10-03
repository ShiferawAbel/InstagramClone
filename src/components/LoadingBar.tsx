// LoadingBar.js
import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    "0": "#f88927",
    "1.0": "#fff"
  },
  shadowBlur: 5,
  barThickness: 3,
});

const LoadingBar = () => <TopBarProgress />;

export default LoadingBar;
