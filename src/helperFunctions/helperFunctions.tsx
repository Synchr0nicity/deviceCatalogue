import {
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";

export const BASE_URL =
  "https://api.restful-api.dev/objects";

export const LoadingIndicator = () => (
  <Box textAlign="center" p="4">
    <Spinner size="xl" />
    <Text mt="4">Loading...</Text>
  </Box>
);
