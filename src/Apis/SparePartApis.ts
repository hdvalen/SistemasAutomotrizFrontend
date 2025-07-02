import type { SparePart } from "../types";

const URL_API = "http://localhost:5070";

function getHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

export const getSpareParts = async (): Promise<SparePart[] | null> => {
    try {
        const response = await fetch(`${URL_API}/api/SparePart`, {
          method: 'GET',
          headers: getHeaders()
        });
        if (response.ok) {
          return await response.json();
        }
        console.error(`GET /api/SparePart falló con status ${response.status}`);
      } catch (error) {
        console.error("Error de red o servidor en getSparePart:", error);
      }
      return null;
    };

export const postSparePart = async (datos: SparePart): Promise<any | undefined> => {
    const { id, ...SparePartData } = datos;
  console.log("📤 postSparePart enviando:", SparePartData);

  const response = await fetch(`${URL_API}/api/SparePart`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(SparePartData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`POST /api/SparePart ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  }

  // 3) el servidor responde con Created (201) y el objeto creado (incluyendo el nuevo id)
  return response.json();
};

export const putSparePart = (datos:SparePart, id: number | string) =>
  fetch(`${URL_API}/api/SparePart/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

export const deleteSparePart = (id: number | string) =>
  fetch(`${URL_API}/api/SparePart/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
