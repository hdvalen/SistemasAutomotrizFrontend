import type { TypeService } from "../types";

const URL_API = "http://localhost:5070";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

export const getTypeService = async (): Promise<TypeService[] | null> => {
    try {
        const response = await fetch(`${URL_API}/api/TypeService`, {
            method: 'GET',
            headers: myHeaders
        });

        switch (response.status) {
            case 200:
                const data: TypeService[] = await response.json();
                return data;
            case 401:
                console.error("No autorizado o token inválido");
                break;
            case 404:
                console.error("El tipo de servicio no existe");
                break;
            default:
                console.error("Error inesperado. Contacte al administrador.");
        }
    } catch (error) {
        console.error("Error de red o servidor:", error);
    }

    return null; // en caso de error
};

export const postTypeService = async (datos: TypeService): Promise<any | undefined> => {
    try {
        // Remove id if present
        const { id, ...TypeServiceData } = datos;
        console.log("Datos enviados a postTypeService:", TypeServiceData);

        const response = await fetch(`${URL_API}/api/TypeService`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(TypeServiceData)
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

export const putTypeService = async (datos: TypeService, id: number | string): Promise<Response | undefined> => {
    try {
        return await fetch(`${URL_API}/api/TypeService/${id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud PUT:', error);
    }
}

export const deleteTypeService = async (id: number | string): Promise<Response | undefined> => {
    try {
        const response = await fetch(`${URL_API}/api/TypeService/${id}`, {
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