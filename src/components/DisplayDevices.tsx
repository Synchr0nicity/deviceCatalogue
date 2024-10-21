import { useRef, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import EditDeviceForm from "./EditDeviceForm.tsx";
import { DeviceStateProps } from "../types/types.ts";
import {
  BASE_URL,
  LoadingIndicator,
} from "../helperFunctions/helperFunctions.tsx";

//MAIN COMPONENT
const DisplayDevices: React.FC<
  DeviceStateProps
> = ({ devices, setDevices }) => {
  const [isLoading, setIsLoading] =
    useState(false);
  //hooks for drawer component
  const btnRef = useRef<HTMLButtonElement | null>(
    null
  );

  const { isOpen, onOpen, onClose } =
    useDisclosure();

  const toast = useToast();

  //hook for device ID tracking to know which device to delete/edit
  const [deviceId, setDeviceID] =
    useState<string>("");

  //handleing delete
  const handleDelete = async (
    currentDeviceId: string
  ): Promise<void> => {
    setDeviceID(currentDeviceId);
    try {
      console.log(deviceId);
      setIsLoading(true);

      //Delete
      const response = await fetch(
        `https://thingproxy.freeboard.io/fetch/
        ${BASE_URL}/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        //Storing object temporarily into Devices State
        const storedDevices: string[] =
          JSON.parse(
            localStorage.getItem("deviceIds") ||
              "[]"
          );
        const updatedDevices =
          storedDevices.filter(
            (id) => id !== deviceId
          );

        localStorage.setItem(
          "deviceIds",
          JSON.stringify(updatedDevices)
        );

        //updateDevices state
        setDevices((prevDevices) =>
          prevDevices.filter(
            (device) => device.id !== deviceId
          )
        );

        //message to user/console
        console.log("Deletion successful");
        toast({
          title: `Device deleted.`,
          description: "You've deleted a device.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        //inform console and user of failure for reason
        console.error(
          "Deletion failed",
          response.status
        );
        toast({
          title: "Error",
          description: response.statusText,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      //inform console and user of failure unsure why
      //Allow typescript to pre know type of error
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast({
        title: "Error",
        description:
          "An unexpected error occurred: " +
          errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>Your devices will display here:</div>

      {devices.length === 0 ? (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p="4"
          bg="white"
          shadow="md"
          minW="300px"
          mx="auto"
          mt="4"
        >
          <Stack spacing={3}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="teal"
            >
              Awesome Device
            </Text>
            <Text>Year: 1997</Text>
            <Text>Price: $499</Text>
            <Text>CPU Model: Macbook M1</Text>
            <Text>Hard Disk Size: 360GB</Text>

            <Flex justifyContent="center" gap="6">
              <Button colorScheme="teal" flex="1">
                Edit
              </Button>
              <Button colorScheme="teal" flex="1">
                Delete
              </Button>
            </Flex>
          </Stack>
        </Box>
      ) : (
        devices.map((device) => (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            bg="white"
            shadow="md"
            minW="300px"
            mx="auto"
            mt="4"
            key={device.id}
          >
            <Stack spacing={3}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="teal"
              >
                {device.name || "Awesome Device"}
              </Text>
              <Text>
                Year: {device.data.year}
              </Text>
              <Text>
                Price: ${+device.data.price}
              </Text>
              <Text>
                CPU Model: {device.data.cpuModel}
              </Text>
              <Text>
                Hard Disk Size:{" "}
                {+device.data.hardDiskSize}
                GB
              </Text>
              <Flex
                justifyContent="center"
                gap="6"
              >
                <Button
                  colorScheme="teal"
                  flex="1"
                  onClick={() => {
                    setDeviceID(device.id);
                    onOpen();
                  }}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="teal"
                  flex="1"
                  onClick={() =>
                    handleDelete(device.id)
                  }
                >
                  {isLoading ? (
                    <LoadingIndicator />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </Flex>
            </Stack>
          </Box>
        ))
      )}
      <EditDeviceForm
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        devices={devices}
        setDevices={setDevices}
        deviceId={deviceId}
      />
    </>
  );
};

export default DisplayDevices;
