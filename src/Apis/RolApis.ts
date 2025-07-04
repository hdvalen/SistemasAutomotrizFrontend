import type { Rol } from "../types";

const URL_API = "http://localhost:5070";
function getHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export const getRol = async (): Promise<Rol[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/Rol`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return await response.json();
    }
    console.error(`GET /api/Rol falló con status ${response.status}`);
  } catch (error) {
    console.error("Error de red o servidor en getRol:", error);
  }
  return null;
};


export const postRol = async (datos: Rol): Promise<any> => {
  // 2) quitamos el id antes de enviar
  const { id, ...rolData } = datos;
  console.log("📤 postRol enviando:", rolData);

  const response = await fetch(`${URL_API}/api/Rol`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(rolData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`POST /api/Rol ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  }

  // 3) el servidor responde con Created (201) y el objeto creado (incluyendo el nuevo id)
  return response.json();
};

export const putRol = (datos: Rol, id: number | string) =>
  fetch(`${URL_API}/api/Rol/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

export const deleteRol = (id: number | string) =>
  fetch(`${URL_API}/api/Rol/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });