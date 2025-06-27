import type { DetailInspection } from "../types";

const URL_API = "http://localhost:5070";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

export const getDetailInspection = async (): Promise<DetailInspection[] | null> => {
    try {
        const response = await fetch(`${URL_API}/api/DetailInspection`, {
            method: 'GET',
            headers: myHeaders
        });

        switch (response.status) {
            case 200:
                const data: DetailInspection[] = await response.json();
                return data;
            case 401:
                console.error("No autorizado o token inválido");
                break;
            case 404:
                console.error("El detalle no existe");
                break;
            default:
                console.error("Error inesperado. Contacte al administrador.");
        }
    } catch (error) {
        console.error("Error de red o servidor:", error);
    }

    return null; // en caso de error
};

export const postDetailInspection = async (datos: DetailInspection): Promise<any | undefined> => {
    try {
        // Remove id if present
        const { id, ...DetailInspectionData } = datos;
        console.log("Datos enviados a postDetailInspection:", DetailInspectionData);

        const response = await fetch(`${URL_API}/api/DetailInspection`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(DetailInspectionData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error en la solicitud POST: ${response.status} - ${errorText}`);
            return undefined;
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud POST:', error);
    }
}

export const putDetailInspection = async (datos: DetailInspection, id: number | string): Promise<Response | undefined> => {
    try {
        return await fetch(`${URL_API}/api/DetailInspection/${id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud PUT:', error);
    }
}

export const deleteDetailInspection = async (id: number | string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${URL_API}/api/DetailInspection/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error en la solicitud DELETE: ${response.status} - ${errorText}`);
        }
        return response;
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error);
    }
}