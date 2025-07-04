import React, { useState } from 'react';
import { getServiceOrdersByClientIdentification, authorizeServiceOrder } from '../Apis/ServiceOrder';
import type { ClientServiceOrder } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const AutorizacionOrderServices: React.FC = () => {
  const [identification, setIdentification] = useState('');
  const [serviceOrders, setServiceOrders] = useState<ClientServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!identification.trim()) {
      setError('Por favor ingrese su número de cédula');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Buscando órdenes para cédula:', identification.trim());
      const orders = await getServiceOrdersByClientIdentification(identification.trim());
      
      console.log('Respuesta del servidor:', orders);
      
      if (orders === null) {
        setError('Error al buscar las órdenes de servicio');
        setServiceOrders([]);
      } else if (orders.length === 0) {
        setMessage('No se encontraron órdenes de servicio pendientes para este cliente');
        setServiceOrders([]);
      } else {
        setServiceOrders(orders);
        setMessage(`Se encontraron ${orders.length} orden(es) de servicio`);
      }
    } catch (error) {
      console.error('Error en handleSearch:', error);
      setError('Error al buscar las órdenes de servicio');
      setServiceOrders([]);
    } finally {
      setLoading(false);
    }
  };

 const handleAuthorize = async (serviceOrderId: number, isAuthorized: boolean) => {
  try {
    setLoading(true);
    const result = await authorizeServiceOrder(serviceOrderId, isAuthorized);
    
    if (result && result.message) {
      setMessage(result.message);
    } else {
      setMessage(isAuthorized ? 'Orden autorizada correctamente' : 'Orden rechazada correctamente');
    }
    
    // Actualizar la lista de órdenes
    setServiceOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === serviceOrderId 
          ? { ...order, isAuthorized } 
          : order
      )
    );
  } catch (error) {
    setError('Error al procesar la autorización');
    console.error('Error en handleAuthorize:', error);
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
   <div className="min-h-screen bg-gray-900 py-8">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        Autorización de Órdenes de Servicio
      </h1>
      <p className="text-gray-300">
        Ingrese su número de cédula para ver y autorizar sus órdenes de servicio pendientes
      </p>
    </div>

    {/* Formulario de búsqueda */}
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="identification" className="block text-sm font-medium text-gray-200 mb-2">
            Número de Cédula
          </label>
          <Input
            id="identification"
            type="text"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
            placeholder="Ingrese su número de cédula"
            className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? 'Buscando...' : 'Buscar Órdenes'}
          </Button>
        </div>
      </div>
    </div>

    {/* Mensajes */}
    {message && (
      <div className="bg-purple-800 border border-purple-600 rounded-md p-4 mb-6">
        <p className="text-purple-200">{message}</p>
      </div>
    )}

    {error && (
      <div className="bg-red-800 border border-red-600 rounded-md p-4 mb-6">
        <p className="text-red-200">{error}</p>
      </div>
    )}

    {/* Lista de órdenes */}
    {serviceOrders.length > 0 && (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          Órdenes de Servicio Pendientes
        </h2>

        {serviceOrders.map((order) => (
          <Card key={order.id} className="p-6 bg-gray-800 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Información del vehículo */}
              <div>
                <h3 className="font-semibold text-white mb-2">Vehículo</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><span className="font-medium">Marca:</span> {order.vehicleBrand}</p>
                  <p><span className="font-medium">Modelo:</span> {order.vehicleModel}</p>
                  <p><span className="font-medium">VIN:</span> {order.vehicleVIN}</p>
                </div>
              </div>

              {/* Información del servicio */}
              <div>
                <h3 className="font-semibold text-white mb-2">Servicio</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><span className="font-medium">Tipo:</span> {order.typeServiceName}</p>
                  <p><span className="font-medium">Precio:</span> {formatCurrency(order.typeServicePrice)}</p>
                  <p><span className="font-medium">Duración:</span> {order.typeServiceDuration} días</p>
                </div>
              </div>

              {/* Fechas y estado */}
              <div>
                <h3 className="font-semibold text-white mb-2">Detalles</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><span className="font-medium">Entrada:</span> {formatDate(order.entryDate)}</p>
                  <p><span className="font-medium">Salida:</span> {formatDate(order.exitDate)}</p>
                  <p>
                    <span className="font-medium">Estado:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      order.stateName === 'Pendiente' ? 'bg-yellow-200 text-yellow-800' :
                      order.stateName === 'En Proceso' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-300 text-gray-800'
                    }`}>
                      {order.stateName}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje del cliente */}
            {order.clientMessage && (
              <div className="mb-4 p-3 bg-gray-700 rounded-md">
                <p className="text-sm text-gray-200">
                  <span className="font-medium">Mensaje:</span> {order.clientMessage}
                </p>
              </div>
            )}

            {/* Estado de autorización */}
            <div className="mb-4">
              <p className="text-sm">
                <span className="font-medium">Estado de autorización:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                  order.isAuthorized 
                    ? 'bg-purple-300 text-purple-900' 
                    : 'bg-red-300 text-red-900'
                }`}>
                  {order.isAuthorized ? 'Autorizada' : 'Pendiente de autorización'}
                </span>
              </p>
            </div>

            {/* Botones de autorización */}
            {!order.isAuthorized && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleAuthorize(order.id, true)}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? 'Procesando...' : 'Autorizar Orden'}
                </Button>
                <Button
                  onClick={() => handleAuthorize(order.id, false)}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Procesando...' : 'Rechazar Orden'}
                </Button>
              </div>
            )}

            {order.isAuthorized && (
              <div className="text-center p-3 bg-purple-700 rounded-md">
                <p className="text-purple-200 font-medium">
                  ✓ Esta orden ya ha sido autorizada
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    )}

    {/* Estado vacío */}
    {serviceOrders.length === 0 && !loading && !message && !error && (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No hay órdenes para mostrar
        </h3>
        <p className="text-gray-400">
          Ingrese su número de cédula para buscar sus órdenes de servicio
        </p>
      </div>
    )}

    {/* Información de debugging */}
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-sm font-medium text-purple-300 mb-2">Información de Debugging:</h3>
      <div className="text-xs text-purple-200 space-y-1">
        <p>• URL del backend: http://localhost:5070</p>
        <p>• Endpoint: /api/ServiceOrder/client/{identification}</p>
        <p>• Estados filtrados: 2 (Pendiente) y 3 (En Proceso)</p>
        <p>• Cédula ingresada: {identification || 'Ninguna'}</p>
        <p>• Órdenes encontradas: {serviceOrders.length}</p>
      </div>
    </div>
  </div>
</div>


  );
};

export default AutorizacionOrderServices;