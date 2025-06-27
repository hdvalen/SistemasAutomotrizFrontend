import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, Eye, Car, Calendar, Wrench } from 'lucide-react';
import type { Vehicle, Client, TypeVehicle} from '../types';
import { getVehicle, putVehicle, deleteVehicle, postVehicle } from '../Apis/vehiclesApis';
import { getClient } from '../Apis/ClientApis';
import { getTypeVehicle } from '../Apis/TypeVehicleApis';

export function Vehiculos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehicle | null>(null);
  const [vehiculos, setVehicles] = useState<Vehicle[]>([]);
  const [filterMarca, setFilterMarca] = useState('');
  const [formValues, setFormValues] = useState<Partial<Vehicle>>({});
  const [clientes, setClientes] = useState<Client[]>([]);
  const [typesVehicles, setTypesVehicles] = useState<TypeVehicle[]>([]);

  //Get Clients
  useEffect(() => {
    getVehicle().then((data) => {
      if (data) {
        setVehicles(data);
      }
    });
  }, []);

  useEffect(() => {
    getClient().then((data) => {
      if (data) setClientes(data);
    });
  }, []);

  useEffect(() => {
    getTypeVehicle().then((data) => {
      if (data) {
        setTypesVehicles(data);
      }
    });
  }, []);

  const filteredVehiculos = vehiculos.filter(vehiculo =>
    (vehiculo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.client?.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterMarca === '' || vehiculo.brand === filterMarca)
  );

  const brands = [...new Set(vehiculos.map(v => v.brand))];

  const handleEdit = (vehiculo: Vehicle) => {
    setSelectedVehiculo(vehiculo);
    setFormValues(vehiculo);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedVehiculo(null);
    setFormValues({});
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (selectedVehiculo) {
       try {
        const response = await putVehicle(formValues as Vehicle, selectedVehiculo.id);
  
        if(!response || !response.ok) {
          throw new Error(`Error: revise ordenes de servicio ACTIVAS`);
        }
  
        Swal.fire({
            icon: 'success',
            title: 'Editado',
            text: 'El vehiculo ha sido editado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
  
        const data = await getVehicle();
        if (data) setVehicles(data);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo editar el vehículo, revise ordenes de servicio activas.',
        });
      }
    } else {
      // Create
      await postVehicle(formValues as Vehicle);
    }
    setShowModal(false);
    // Refresh vehicles list
    const data = await getVehicle();
    if (data) setVehicles(data);
  };

  const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: '¿Esta seguro de eliminar el vehiculo?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteVehicle(id);

        if (!response || !response.ok) {
          throw new Error(`Error: revise ordenes de servicio ACTIVAS`);
        }

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El vehiculo ha sido eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });

        const data = await getVehicle();
        if (data) setVehicles(data);

      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el vehiculo, revise ordenes de servicio activas.',
        });
      }
    }
  };

  // Función para obtener el nombre del cliente
  const getClientName = (clientId: number): string => {
    const client = clientes.find(c => c.id === clientId);
    return client ? `${client.name} ${client.lastName}` : 'N/A';
  };

  // Función para obtener el nombre del tipo de vehículo
  const getTypeVehicleName = (typeVehicleId: number) => {
    const type = typesVehicles.find(t => t.id === Number(typeVehicleId));
    return type ? type.name : 'N/A';
  };

  const averageMileage = (vehiculos: Vehicle[]): number => {
    if (vehiculos.length === 0) return 0;

    const totalMileage = vehiculos.reduce((sum, v) => sum + v.mileage, 0);
    return totalMileage / vehiculos.length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Gestión de Vehículos
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Administra el parque automotor de tus clientes</p>
          </div>
          <Button 
            onClick={handleCreate} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Vehículo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Vehículos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{vehiculos.length}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Car className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Km Promedio</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{Math.round(averageMileage(vehiculos)).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Marcas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{brands.length}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Activos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{vehiculos.length}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-white border border-gray-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                Lista de Vehículos
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select 
                  value={filterMarca} 
                  onChange={(e) => setFilterMarca(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                >
                  <option value="">Todas las marcas</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar vehículos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Propietario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Kilometraje
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <Car className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {vehiculo.brand} • {vehiculo.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vehiculo.vin} 
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {getClientName(vehiculo.clientId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {clientes.find(c => c.id === vehiculo.clientId)?.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">Tipo:</span> {getTypeVehicleName(vehiculo.typeVehicleId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">VIN:</span> {vehiculo.vin.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {vehiculo.mileage.toLocaleString()} km
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-colors duration-150"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(vehiculo)} 
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 p-2 rounded-lg transition-colors duration-150"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-colors duration-150" 
                            onClick={() => handleDelete(vehiculo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </h2>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Car className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente</label>
                  <Select
                    name="clientId"
                    value={formValues.clientId || ''}
                    onChange={e => setFormValues(prev => ({
                      ...prev,
                      clientId: Number(e.target.value)
                    }))}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.name} {cliente.lastName}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                  <Input 
                    name="brand" 
                    value={formValues.brand || ''} 
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
                  <Input 
                    name="model" 
                    value={formValues.model || ''} 
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">VIN</label>
                  <Input 
                    name="vin" 
                    value={formValues.vin || ''} 
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kilometraje</label>
                  <Input 
                    type="number" 
                    name="mileage" 
                    value={formValues.mileage || ''} 
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo Vehículo</label>
                  <Select 
                    name="typeVehicleId"
                    value={formValues.typeVehicleId || ''} 
                    onChange={e => setFormValues(prev => ({
                      ...prev,
                      typeVehicleId: Number(e.target.value)
                    }))}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  >
                    <option value="">Seleccionar tipo vehículo</option>
                    {typesVehicles.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {selectedVehiculo ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}