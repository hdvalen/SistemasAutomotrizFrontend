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
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6B7280',
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Gestión de Vehículos
          </h1>
          <p className="text-neutral-600 mt-1">Administra el parque automotor de tus clientes</p>
        </div>
        <Button onClick={handleCreate} className="shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Vehículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Total Vehículos</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{vehiculos.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-medium">
                <Car className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Km Promedio</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{averageMileage(vehiculos)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 shadow-medium">
                <Eye className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Lista de Vehículos
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterMarca} onChange={(e) => setFilterMarca(e.target.value)}>
                <option value="">Todas las marcas</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </Select>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar vehículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Propietario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Kilometraje
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredVehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-neutral-900">
                            {vehiculo.brand} • {vehiculo.model}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {vehiculo.vin} 
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">
                        {getClientName(vehiculo.clientId)}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {clientes.find(c => c.id === vehiculo.clientId)?.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        Tipo: {getTypeVehicleName(vehiculo.typeVehicleId)}
                      </div>
                      <div className="text-sm text-neutral-500">VIN: {vehiculo.vin.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-neutral-900">
                        {vehiculo.mileage.toLocaleString()} km
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(vehiculo)} className="hover:bg-primary-50 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600" onClick={() => handleDelete(vehiculo.id)}>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Cliente"
                name="clientId"
                value={formValues.clientId || ''}
                onChange={e => setFormValues(prev => ({
                  ...prev,
                  clientId: Number(e.target.value)
                }))}
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} {cliente.lastName}
                  </option>
                ))}
              </Select>
              <Input label="Marca" name="brand" value={formValues.brand || ''} onChange={handleInputChange}/>
              <Input label="Modelo" name="model" value={formValues.model || ''} onChange={handleInputChange} />
              <Input label="VIN" name="vin" value={formValues.vin || ''} onChange={handleInputChange}  />
              <Input label="Kilometraje" type="number" name="mileage" value={formValues.mileage || ''} onChange={handleInputChange}/>
              <Select 
                label="Tipo Vehiculo" 
                name="typeVehicleId"
                value={formValues.typeVehicleId || ''} 
                onChange={e => setFormValues(prev => ({
                  ...prev,
                  typeVehicleId: Number(e.target.value)
                }))}
              >
                <option value="">Seleccionar tipo vehículo</option>
                {typesVehicles.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {selectedVehiculo ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}