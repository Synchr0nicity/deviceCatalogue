import React, { useState } from "react";
import CatalogueEntryForm from "./components/CatalogueEntryForm";

type DeviceData = {
  year: string;
  price: string;
  cpuModel: string;
  hardDiskSize: string;
};

type DeviceFormData = {
  name: string;
  data: DeviceData;
};

const App: React.FC = () => {
  const [formData, setFormData] =
    useState<DeviceFormData>({
      name: "",
      data: {
        year: "",
        price: "",
        cpuModel: "",
        hardDiskSize: "",
      },
    });

  return (
    <CatalogueEntryForm
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default App;
