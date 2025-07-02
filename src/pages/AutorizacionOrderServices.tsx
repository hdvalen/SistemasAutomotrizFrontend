import { Input } from "../components/ui/Input";


export function AutorizacionOrdenServicio() {

    const hanleEnviar = async () => {
      };
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md text-center">
    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
      Autoriza la orden de servicio
    </h2>

    <div className="space-y-4 mb-6">
      <Input
        label="Número de Cédula"
        name="cedula"
        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Ej: 12345678"
      />
    </div>

    <button
      onClick={hanleEnviar}
      className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
    >
      Buscar
    </button>
  </div>
</div>

    );
}