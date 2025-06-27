import type { TypeVehicle } from "../types";

const URL_API = "http://localhost:5070";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

export const getTypeVehicle = async (): Promise<TypeVehicle[] | null> => {
    try {
        const response = await fetch(`${URL_API}/api/TypeVehicle`, {
            method: 'GET',
            headers: myHeaders
        });

        switch (response.status) {
            case 200:
                const data: TypeVehicle[] = await response.json();
                return data;
            case 401:
                console.error("No autorizado o token inválido");
                break;
            case 404:
                console.error("El tipo de vehiculo no existe");
                break;
            default:
                console.error("Error inesperado. Contacte al administrador.");
        }
    } catch (error) {
        console.error("Error de red o servidor:", error);
    }

    return null; // en caso de error
};

export const postTypeVehicle = async (datos: TypeVehicle): Promise<any | undefined> => {
    try {
        // Remove id if present
        const { id, ...clientTypeVehicle } = datos;
        console.log("Datos enviados a postTypeVehicle:", clientTypeVehicle);

        const response = await fetch(`${URL_API}/api/TypeVehicle`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(clientTypeVehicle)
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

export const putTypeVehicle = async (datos: TypeVehicle, id: number | string): Promise<Response | undefined> => {
    try {
        return await fetch(`${URL_API}/api/TypeVehicle/${id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud PUT:', error);
    }
}

export const deleteTypeVehicle = async (id: number | string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${URL_API}/api/TypeVehicle/${id}`, {
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