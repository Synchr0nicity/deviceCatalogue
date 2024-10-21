import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    teal: {
      50: "#E6FFFA", // Lightest
      100: "#B2F5EA",
      200: "#81E6D9",
      300: "#4FD1C5",
      400: "#38B2A5",
      500: "#319795", // Default
      600: "#2C7A7B",
      700: "#285E61",
      800: "#234E52",
      900: "#1D4044", // Darkest
    },
  },
});

export default theme;
