import type { Auditory } from "../types";

const URL_API = "http://localhost:5070";

function getHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export const getAuditory = async (): Promise<Auditory[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/Auditory`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return await response.json();
    }
    console.error(`GET /api/Auditory falló con status ${response.status}`);
  } catch (error) {
    console.error("Error de red o servidor en getAuditory:", error);
  }
  return null;
};

export const postAuditory = async (datos: Auditory): Promise<any> => {
  // 2) quitamos el id antes de enviar
  const { id, ...auditoryData } = datos;
  console.log("📤 postAuditory enviando:", auditoryData);

  const response = await fetch(`${URL_API}/api/Auditory`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(auditoryData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`POST /api/Auditory ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  }

  // 3) el servidor responde con Created (201) y el objeto creado (incluyendo el nuevo id)
  return response.json();
};

export const putAuditory = (datos: Auditory, id: number | string) =>
  fetch(`${URL_API}/api/Auditory/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

export const deleteAuditory = (id: number | string) =>
  fetch(`${URL_API}/api/Auditory/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });