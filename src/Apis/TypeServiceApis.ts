import type { TypeService } from "../types";

const URL_API = "http://localhost:5070";

function getHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export const getTypeService = async (): Promise<TypeService[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/TypeService`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return await response.json();
    }
    console.error(`GET /api/TypeService falló con status ${response.status}`);
  } catch (error) {
    console.error("Error de red o servidor en getTypeService:", error);
  }
  return null;
};

export const postTypeService = async (datos: TypeService): Promise<any> => {
  // 2) quitamos el id antes de enviar
  const { id, ...typeServiceData } = datos;
  console.log("📤 postTypeService enviando:", typeServiceData);

  const response = await fetch(`${URL_API}/api/TypeService`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(typeServiceData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`POST /api/TypeService ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  }

  // 3) el servidor responde con Created (201) y el objeto creado (incluyendo el nuevo id)
  return response.json();
};

export const putTypeService = (datos: TypeService, id: number | string) =>
  fetch(`${URL_API}/api/TypeService/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

export const deleteTypeService = (id: number | string) =>
  fetch(`${URL_API}/api/TypeService/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });