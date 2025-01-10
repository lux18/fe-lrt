import React, { useEffect, useState } from "react";

const DropdownWilayah = ({ onLocationChange, selectedLocation }) => {
  useEffect(() => {
    if (selectedLocation) {
      const locationParts = selectedLocation.split(",");
      setSelectedProvince({
        id: "",
        name: locationParts[0],
      });
      setSelectedRegency({
        id: "",
        name: locationParts[1],
      });
      setSelectedDistrict({
        id: "",
        name: locationParts[2],
      });
      setSelectedVillage({
        id: "",
        name: locationParts[3],
      });
    }
  }, [selectedLocation]);

  const [selectedProvince, setSelectedProvince] = useState({
    id: "",
    name: "",
  });
  const [selectedRegency, setSelectedRegency] = useState({
    id: "",
    name: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: "",
    name: "",
  });
  const [selectedVillage, setSelectedVillage] = useState({
    id: "",
    name: "",
  });

  const [dataWilayah, setDataWilayah] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isRegencyDropdownOpen, setIsRegencyDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isVillageDropdownOpen, setIsVillageDropdownOpen] = useState(false);

  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://kanglerian.github.io/api-wilayah-indonesia/api/provinces.json",
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setDataWilayah(data);
    } catch (error) {
      console.error("Error fetching provinces:", error.message);
    }
  };

  const fetchRegencies = async (provinceId) => {
    try {
      const response = await fetch(
        `https://kanglerian.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setRegencies(data);
    } catch (error) {
      console.error("Error fetching regencies:", error.message);
    }
  };

  const fetchDistricts = async (regencyId) => {
    try {
      const response = await fetch(
        `https://kanglerian.github.io/api-wilayah-indonesia/api/districts/${regencyId}.json`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error.message);
    }
  };

  const fetchVillages = async (districtId) => {
    try {
      const response = await fetch(
        `https://kanglerian.github.io/api-wilayah-indonesia/api/villages/${districtId}.json`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setVillages(data);
    } catch (error) {
      console.error("Error fetching villages:", error.message);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleSelect = (id, name, type) => {
    let updatedLocation = {
      province: selectedProvince,
      regency: selectedRegency,
      district: selectedDistrict,
      village: selectedVillage,
    };

    if (type === "province") {
      setSelectedProvince({ id, name });
      setSelectedRegency({ id: "", name: "" });
      setSelectedDistrict({ id: "", name: "" });
      setSelectedVillage({ id: "", name: "" });
      setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
      setIsRegencyDropdownOpen(true);
      fetchRegencies(id);
      updatedLocation.province = { id, name };
    } else if (type === "regency") {
      setSelectedRegency({ id, name });
      setSelectedDistrict({ id: "", name: "" });
      setSelectedVillage({ id: "", name: "" });
      setIsRegencyDropdownOpen(!isRegencyDropdownOpen);
      setIsDistrictDropdownOpen(true);
      fetchDistricts(id);
      updatedLocation.regency = { id, name };
    } else if (type === "district") {
      setSelectedDistrict({ id, name });
      setSelectedVillage({ id: "", name: "" });
      setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
      setIsVillageDropdownOpen(true);
      fetchVillages(id);
      updatedLocation.district = { id, name };
    } else if (type === "village") {
      setSelectedVillage({ id, name });
      setIsVillageDropdownOpen(!isVillageDropdownOpen);
      updatedLocation.village = { id, name };
    }

    if (
      updatedLocation.province.name &&
      updatedLocation.regency.name &&
      updatedLocation.district.name &&
      updatedLocation.village.name
    ) {
      onLocationChange(
        `${updatedLocation.province.name},${updatedLocation.regency.name},${updatedLocation.district.name},${updatedLocation.village.name}`,
      );
    }
  };

  const toggleDropdown = (type) => {
    switch (type) {
      case "province":
        setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
        setIsRegencyDropdownOpen(false);
        setIsDistrictDropdownOpen(false);
        setIsVillageDropdownOpen(false);
        break;
      case "regency":
        setIsProvinceDropdownOpen(false);
        setIsRegencyDropdownOpen(!isRegencyDropdownOpen);
        setIsDistrictDropdownOpen(false);
        setIsVillageDropdownOpen(false);
        break;
      case "district":
        setIsProvinceDropdownOpen(false);
        setIsRegencyDropdownOpen(false);
        setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
        setIsVillageDropdownOpen(false);
        break;
      case "village":
        setIsProvinceDropdownOpen(false);
        setIsRegencyDropdownOpen(false);
        setIsDistrictDropdownOpen(false);
        setIsVillageDropdownOpen(!isVillageDropdownOpen);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="dropdown">
        <button
          className="dropdown-btn"
          onClick={() => toggleDropdown("province")}
        >
          {selectedProvince.name ? selectedProvince.name : "Provinsi"}
        </button>
        {isProvinceDropdownOpen && (
          <div className="dropdown-content">
            {dataWilayah.map((province) => (
              <div
                key={province.id}
                onClick={() =>
                  handleSelect(province.id, province.name, "province")
                }
              >
                {province.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dropdown">
        <button
          className="dropdown-btn"
          onClick={() => toggleDropdown("regency")}
          disabled={!selectedProvince.id}
        >
          {selectedRegency.name
            ? selectedRegency.name
            : selectedProvince.id
            ? "Kota/Kabupaten"
            : "Mohon Pilih Provinsi terlebih dahulu"}
        </button>
        {isRegencyDropdownOpen && selectedProvince.id && (
          <div className="dropdown-content">
            {regencies
              .filter((regency) => regency.province_id === selectedProvince.id)
              .map((regency) => (
                <div
                  key={regency.id}
                  onClick={() =>
                    handleSelect(regency.id, regency.name, "regency")
                  }
                >
                  {regency.name}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="dropdown">
        <button
          className="dropdown-btn"
          onClick={() => toggleDropdown("district")}
          disabled={!selectedRegency.id}
        >
          {selectedDistrict.name
            ? selectedDistrict.name
            : selectedRegency.id
            ? "Kecamatan"
            : "Mohon Pilih Kota/Kabupaten terlebih dahulu"}
        </button>
        {isDistrictDropdownOpen && selectedRegency.id && (
          <div className="dropdown-content">
            {districts
              .filter((district) => district.regency_id === selectedRegency.id)
              .map((district) => (
                <div
                  key={district.id}
                  onClick={() =>
                    handleSelect(district.id, district.name, "district")
                  }
                >
                  {district.name}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="dropdown">
        <button
          className="dropdown-btn"
          onClick={() => toggleDropdown("village")}
          disabled={!selectedDistrict.id}
        >
          {selectedVillage.name
            ? selectedVillage.name
            : selectedDistrict.id
            ? "Desa/Kelurahan"
            : "Mohon Pilih Kecamatan terlebih dahulu"}
        </button>
        {isVillageDropdownOpen && selectedDistrict.id && (
          <div className="dropdown-content">
            {villages
              .filter((village) => village.district_id === selectedDistrict.id)
              .map((village) => (
                <div
                  key={village.id}
                  onClick={() =>
                    handleSelect(village.id, village.name, "village")
                  }
                >
                  {village.name}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownWilayah;
