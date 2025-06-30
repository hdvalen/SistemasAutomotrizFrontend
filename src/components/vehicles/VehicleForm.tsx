import React, { useEffect, useState } from "react";
import { postVehicle } from "../../Apis/vehiclesApis";
import type { Vehicle } from "../../types";

type TypeVehicle = {
  id: number;
  name: string;
};

const URL_API = "http://localhost:5070";

const VehicleForm: React.FC = () => {
  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({
  brand: "",
  model: "",
  vin: "",
  mileage: 0,
  typeVehicleId: undefined,
  clientId: 0
  });


  const [typeVehicles, setTypeVehicles] = useState<TypeVehicle[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
        setVehicle((prev) => ({
      ...prev,
      [name]: name === "mileage" || name === "typeVehicleId" || name === "clientId"
        ? parseInt(value)
        : value,
    }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando vehículo:", vehicle);
    const res = await postVehicle(vehicle as Vehicle);
    if (res) {
      alert("Vehículo creado con éxito");
      setVehicle({
        brand: "",
        model: "",
        vin: "",
        mileage: 0,
        typeVehicleId: 1,
        clientId: 0
      });
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${URL_API}/api/TypeVehicle`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Type vehicles:", data); // 👈 Verifica esto
          setTypeVehicles(data);
        } else {
          console.error("Error al obtener tipos de vehículo", res.status);
        }
      } catch (err) {
        console.error("Error de red:", err);
      }
    };

    fetchTypes();
  }, []);



  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Vehículo</h2>

      <input
        type="text"
        name="brand"
        placeholder="Marca"
        value={vehicle.brand}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="model"
        placeholder="Modelo"
        value={vehicle.model}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="vin"
        placeholder="VIN"
        value={vehicle.vin}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="number"
        name="mileage"
        placeholder="Kilometraje"
        value={vehicle.mileage}
        onChange={handleChange}
        required
      />
      <br />

      <select
        name="typeVehicleId"
        value={vehicle.typeVehicleId ?? 0}
        onChange={handleChange}
        required
      >
        <option value={0}>-- Tipo de Vehículo --</option>
        {typeVehicles.map((tv) => (
          <option key={tv.id} value={tv.id}>
            {tv.name}
          </option>
        ))}
      </select>

      <br />

      <input
        type="number"
        name="clientId"
        placeholder="ID Cliente"
        value={vehicle.clientId}
        onChange={handleChange}
        required
      />
      <br />

      <button type="submit">Guardar</button>
    </form>
  );
};

export default VehicleForm;
