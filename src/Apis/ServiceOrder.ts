import type { ServiceOrder, ClientServiceOrder } from "../types";

const URL_API = "http://localhost:5070";

function getHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

export const getServiceOrder = async (): Promise<ServiceOrder[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/ServiceOrder`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (response.ok) {
      return await response.json();
    }
    console.error(`GET /api/ServiceOrder falló con status ${response.status}`);
  } catch (error) {
    console.error("Error de red o servidor en getAuditory:", error);
  }
  return null;
};

export const postServiceOrder = async (datos: ServiceOrder): Promise<any> => {
  // 2) quitamos el id antes de enviar
  const { id, ...serviceOrderData } = datos;
  console.log("📤 postAuditory enviando:", serviceOrderData);

  const response = await fetch(`${URL_API}/api/ServiceOrder`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(serviceOrderData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`POST /api/ServiceOrder ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  }

  // 3) el servidor responde con Created (201) y el objeto creado (incluyendo el nuevo id)
  return response.json();
};

export const generateServiceOrder = async (serviceOrderId: number, datos: ServiceOrder): Promise<any | undefined> => {
    try {
        // Remove id if present
        const { id, ...serviceOrderData } = datos;
        console.log("Datos enviados a postServiceOrder:", serviceOrderData);

        const response = await fetch(`${URL_API}/api/ServiceOrder/${serviceOrderId}/details`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(serviceOrderData)
        });
        const result = await response.json(); // Siempre intenta leer el JSON
        return result;
    } catch (error) {
        console.error('Error en la solicitud POST:', error);
    }
}

export const putServiceOrder = (datos: ServiceOrder, id: number | string) =>
  fetch(`${URL_API}/api/ServiceOrder/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(datos)
  });

export const deleteServiceOrder = (id: number | string) =>
  fetch(`${URL_API}/api/ServiceOrder/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

export const getServiceOrdersByClientIdentification = async (identification: string): Promise<ClientServiceOrder[] | null> => {
  try {
    const response = await fetch(`${URL_API}/api/ServiceOrder/client/${identification}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 404) {
      console.log("No se encontraron órdenes para este cliente");
      return [];
    }
    
    console.error(`GET /api/ServiceOrder/client/${identification} falló con status ${response.status}`);
  } catch (error) {
    console.error("Error de red o servidor en getServiceOrdersByClientIdentification:", error);
  }
  return null;
};

export const authorizeServiceOrder = async (serviceOrderId: number, isAuthorized: boolean, clientMessage?: string): Promise<any> => {
  try {
    const response = await fetch(`${URL_API}/api/ServiceOrder/${serviceOrderId}/authorize`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serviceOrderId,
        isAuthorized,
        clientMessage
      })
    });

    if (response.ok) {
      return await response.json();
    }

    const errorText = await response.text();
    console.error(`PATCH /api/ServiceOrder/${serviceOrderId}/authorize ERROR ${response.status}:`, errorText);
    throw new Error(errorText || `Error ${response.status}`);
  } catch (error) {
    console.error("Error en authorizeServiceOrder:", error);
    throw error;
  }
};