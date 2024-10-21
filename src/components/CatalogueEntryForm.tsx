import React, {
  useState,
  useRef,
  useEffect,
} from "react";
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
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import DisplayDevices from "./DisplayDevices.tsx";
import {
  DeviceResponse,
  CatalogueProps,
} from "../types/types";
import {
  BASE_URL,
  LoadingIndicator,
} from "../helperFunctions/helperFunctions.tsx";

//main component {MAIN!!}
const CatalogueEntryForm: React.FC<
  CatalogueProps
> = ({ formData, setFormData }) => {
  //states
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  //Main devices state
  const [devices, setDevices] = useState<
    DeviceResponse[]
  >([]);

  //Function to fetch devices for useRef
  const fetchDevices = async () => {
    const deviceIdsArr = JSON.parse(
      localStorage.getItem("deviceIds") || "[]"
    );

    if (deviceIdsArr.length > 0) {
      try {
        const fetchedDevices = await Promise.all(
          deviceIdsArr.map(async (id: string) => {
            const response = await fetch(
              `https://api.restful-api.dev/objects/${id}`
            );
            if (!response.ok) {
              throw new Error(
                `Error fetching device with id: ${id}`
              );
            }
            return await response.json();
          })
        );
        setDevices(fetchedDevices);
      } catch (error) {
        console.error(
          "Error fetching devices:",
          error
        );
      }
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  //for hidden menu effect in Chakra
  const btnRef = useRef<HTMLButtonElement | null>(
    null
  );

  const { isOpen, onOpen, onClose } =
    useDisclosure();

  const toast = useToast();

  //handle submit fetch etc
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    //fetch request (POST)
    //storing body in variable
    const payLoad = {
      name: formData.name,
      data: {
        year: formData.data.year,
        price: formData.data.price,
        cpuModel: formData.data.cpuModel,
        hardDiskSize: formData.data.hardDiskSize,
      },
    };

    try {
      setIsLoading(true);

      //post data
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });

      if (response.ok) {
        //inform console and user of success
        const data = await response.json();

        console.log(
          "Registration successful",
          data
        );
        toast({
          title: `Registration Successful.`,
          description:
            "You've registered successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        //setting up ids in local Storage
        const existingIds = JSON.parse(
          localStorage.getItem("deviceIds") ||
            "[]"
        );
        const newDeviceId = data.id;
        const updatedDeviceIds = [
          ...existingIds,
          newDeviceId,
        ];

        localStorage.setItem(
          "deviceIds",
          JSON.stringify(updatedDeviceIds)
        );

        //Storing object temporarily into Devices State
        setDevices((prevDevices) => [
          ...prevDevices,
          data,
        ]);
        //reset state used for current additions
        setFormData({
          name: "",
          data: {
            year: "",
            price: "",
            cpuModel: "",
            hardDiskSize: "",
          },
        });
      } else {
        //inform console and user of failure for reason
        console.error(
          "Registration failed",
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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        data: {
          ...prevFormData.data,
          [name]:
            name === "year" || name === "price"
              ? Number(value)
              : value,
        },
      }));
    }
  };

  return (
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
        <Flex alignItems="center" gap="2">
          <div>
            You can add your devices by clicking
            here
          </div>
          <ArrowForwardIcon />

          <Button
            ref={btnRef}
            onClick={onOpen}
            colorScheme="teal"
          >
            Open Device Entry
          </Button>
        </Flex>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              Device Catalogue Entry
            </DrawerHeader>

            <DrawerBody>
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel htmlFor="name">
                          Name
                        </FormLabel>
                        <Input
                          id="name"
                          placeholder="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
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
                          value={
                            formData.data.year
                          }
                          onChange={handleChange}
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
                          value={
                            formData.data.price
                          }
                          onChange={handleChange}
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
                          value={
                            formData.data.cpuModel
                          }
                          onChange={handleChange}
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
                          value={
                            formData.data
                              .hardDiskSize
                          }
                          onChange={handleChange}
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="teal"
                      >
                        Add Device
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
      <DisplayDevices
        devices={devices}
        setDevices={setDevices}
      />
    </Flex>
  );
};

export default CatalogueEntryForm;
