import type { Vehicle } from "../types";

const URL_API = "http://localhost:5070";

// Función para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });
};

// GET: Obtener todos los vehículos
export const getVehicle = async (): Promise<Vehicle[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/Vehicle`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    switch (response.status) {
      case 200:
        const data: Vehicle[] = await response.json();
        return data;
      case 401:
        console.error("No autorizado o token inválido");
        break;
      case 404:
        console.error("El vehículo no existe");
        break;
      default:
        console.error("Error inesperado. Contacte al administrador.");
    }
  } catch (error) {
    console.error("Error de red o servidor:", error);
  }

  return null; // En caso de error
};

// POST: Registrar nuevo vehículo
export const postVehicle = async (datos: Vehicle): Promise<any | undefined> => {
  try {
    const { id, ...vehicleData } = datos; // Eliminar ID si viene
    console.log("Datos enviados a postVehicle:", vehicleData);

    const response = await fetch(`${URL_API}/api/Vehicle`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(vehicleData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la solicitud POST: ${response.status} - ${errorText}`);
      return undefined;
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud POST:", error);
  }
};

// PUT: Actualizar vehículo
export const putVehicle = async (datos: Vehicle, id: number | string): Promise<Response | undefined> => {
  try {
    return await fetch(`${URL_API}/api/Vehicle/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(datos)
    });
  } catch (error) {
    console.error("Error en la solicitud PUT:", error);
  }
};

// DELETE: Eliminar vehículo
export const deleteVehicle = async (id: number | string): Promise<Response | undefined> => {
  try {
    const response = await fetch(`${URL_API}/api/Vehicle/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la solicitud DELETE: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error("Error en la solicitud DELETE:", error);
  }
};
