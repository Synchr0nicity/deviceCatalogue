import { RefObject } from "react";

export type DeviceData = {
  year: string;
  price: string;
  cpuModel: string;
  hardDiskSize: string;
};

export type DeviceFormData = {
  name: string;
  data: DeviceData;
};

export interface DeviceResponse {
  id: string;
  name: string;
  data: DeviceData;
}

export type CatalogueProps = {
  formData: DeviceFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<DeviceFormData>
  >;
};

export type DeviceStateProps = {
  devices: DeviceResponse[];
  setDevices: React.Dispatch<
    React.SetStateAction<DeviceResponse[]>
  >;
};

export interface DisclosureProps {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef: RefObject<HTMLElement>;
  deviceId: string;
}

export type EditDeviceStateProps =
  DeviceStateProps & DisclosureProps;
