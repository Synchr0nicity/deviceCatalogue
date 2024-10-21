import { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import {
  EditDeviceStateProps,
  DeviceResponse,
  DeviceFormData,
} from "../types/types.ts";
import {
  BASE_URL,
  LoadingIndicator,
} from "../helperFunctions/helperFunctions.tsx";

//MAIN COMPONENT
const EditDeviceForm: React.FC<
  EditDeviceStateProps
> = ({
  devices,
  setDevices,
  isOpen,
  onClose,
  finalFocusRef,
  deviceId,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] =
    useState(false);

  const createPayLoad = (
    devices: DeviceResponse[],
    deviceId: string
  ): DeviceFormData | undefined => {
    const deviceToUpdate = devices.find(
      (device) => device.id === deviceId
    );
    if (deviceToUpdate) {
      return {
        name: deviceToUpdate.name,
        data: {
          year: deviceToUpdate.data.year,
          price: deviceToUpdate.data.price,
          cpuModel: deviceToUpdate.data.cpuModel,
          hardDiskSize:
            deviceToUpdate.data.hardDiskSize,
        },
      };
    }
    return undefined;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    //fetch request (PUT)
    //storing body in variable

    try {
      setIsLoading(true);

      //put data
      const response = await fetch(
        `${BASE_URL}/${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            createPayLoad(devices, deviceId)
          ),
        }
      );

      if (response.ok) {
        //inform console and user of success
        const data = await response.json();

        console.log("Update successful", data);
        toast({
          title: `Update Successful.`,
          description:
            "You've updated your device.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        //Storing object temporarily into Devices State
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === data.id ? data : device
          )
        );
      } else {
        //inform console and user of failure for reason
        console.error(
          "Update failed",
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

  //Handle change function
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    deviceId: string
  ) => {
    const { name, value } = e.target;

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              name:
                name === "name"
                  ? value
                  : device.name,
              data: {
                ...device.data,
                [name]:
                  name === "year" ||
                  name === "price"
                    ? Number(value)
                    : value,
              },
            }
          : device
      )
    );
  };

  const deviceToUpdate = devices.find(
    (device) => device.id === deviceId
  )!;

  if (!deviceToUpdate) {
    return null;
  }

  const { name: deviceName, data } =
    deviceToUpdate;
  const { cpuModel, price, year, hardDiskSize } =
    data;

  return (
    <>
      {deviceToUpdate && (
        <Flex
          width="100vw"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p="8"
        >
          <Flex
            width="100vw"
            alignItems="center"
            justifyContent="center"
            p="8"
          >
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={finalFocusRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                  Edit your device here:
                </DrawerHeader>

                <DrawerBody>
                  {isLoading ? (
                    <LoadingIndicator />
                  ) : (
                    <>
                      <form
                        onSubmit={handleSubmit}
                      >
                        <Stack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel htmlFor="name">
                              Name
                            </FormLabel>
                            <Input
                              id="name"
                              placeholder="Name"
                              name="name"
                              value={deviceName}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  deviceId
                                )
                              }
                            />
                            <FormHelperText>
                              Name of device
                            </FormHelperText>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel htmlFor="year">
                              Year
                            </FormLabel>
                            <Input
                              id="year"
                              placeholder="Year"
                              name="year"
                              type="number"
                              value={year}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  deviceId
                                )
                              }
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel htmlFor="price">
                              Price
                            </FormLabel>
                            <Input
                              id="price"
                              placeholder="Price"
                              name="price"
                              type="number"
                              value={price}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  deviceId
                                )
                              }
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel htmlFor="cpuModel">
                              CPU Model
                            </FormLabel>
                            <Input
                              id="cpuModel"
                              placeholder="CPU Model"
                              name="cpuModel"
                              value={cpuModel}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  deviceId
                                )
                              }
                            />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel htmlFor="hardDiskSize">
                              Hard Disk Size
                            </FormLabel>
                            <Input
                              id="hardDiskSize"
                              placeholder="Hard Disk Size"
                              name="hardDiskSize"
                              value={hardDiskSize}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  deviceId
                                )
                              }
                            />
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="teal"
                          >
                            Save edits
                          </Button>
                        </Stack>
                      </form>
                    </>
                  )}
                </DrawerBody>
                <DrawerFooter>
                  <Button
                    variant="outline"
                    mr={3}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default EditDeviceForm;
