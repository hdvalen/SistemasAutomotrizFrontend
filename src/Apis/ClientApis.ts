// src/Apis/ClientApis.ts
import type { Client } from "../types";

const URL_API = "http://localhost:5070";

// 1) Helper para construir headers con Content-Type y Bearer token
function getHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export const getClient = async (): Promise<Client[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/Client`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return await response.json();
    }
    console.error(`GET /api/Client falló con status ${response.status}`);
  } catch (error) {
    console.error("Error de red o servidor en getClient:", error);
  }
  return null;
};

export const postClient = async (datos: Client): Promise<any> => {
  const { id, ...clientData } = datos;

  if (!clientData.telephoneNumbers || clientData.telephoneNumbers.length === 0) {
    throw new Error("Debe incluir al menos un número de teléfono.");
  }

  // Convertir el array de objetos a array de strings
  const transformedData = {
    ...clientData,
    telephoneNumbers: clientData.telephoneNumbers.map(t => t.number)
  };

  console.log("📤 Enviando a /register-with-vehicles:", transformedData);

  const response = await fetch(`${URL_API}/api/Client/register-with-vehicles`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(transformedData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`POST /register-with-vehicles ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
};




export const putClient = (datos: Client, id: number | string) =>
  fetch(`${URL_API}/api/Client/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

export const deleteClient = (id: number | string) =>
  fetch(`${URL_API}/api/Client/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
