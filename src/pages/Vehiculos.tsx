import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, Eye, Car, Calendar, Wrench } from 'lucide-react';
import { Vehiculo, Cliente } from '../types';

// Mock data
const mockClientes: Cliente[] = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com', telefono: '+1234567890', direccion: 'Calle 123 #45-67', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  { id: '2', nombre: 'María', apellido: 'González', email: 'maria.gonzalez@email.com', telefono: '+1234567891', direccion: 'Avenida 456 #78-90', createdAt: '2024-01-16T11:15:00Z', updatedAt: '2024-01-16T11:15:00Z' },
  { id: '3', nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@email.com', telefono: '+1234567892', direccion: 'Carrera 789 #12-34', createdAt: '2024-01-17T09:45:00Z', updatedAt: '2024-01-17T09:45:00Z' },
];

const mockVehiculos: (Vehiculo & { cliente: Cliente })[] = [
  {
    id: '1',
    clienteId: '1',
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
    placa: 'ABC-123',
    vin: '1HGBH41JXMN109186',
    color: 'Blanco',
    kilometraje: 45000,
    cliente: mockClientes[0],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    clienteId: '2',
    marca: 'Honda',
    modelo: 'Civic',
    año: 2019,
    placa: 'DEF-456',
    vin: '2HGFC2F59JH123456',
    color: 'Negro',
    kilometraje: 62000,
    cliente: mockClientes[1],
    createdAt: '2024-01-16T11:15:00Z',
    updatedAt: '2024-01-16T11:15:00Z',
  },
  {
    id: '3',
    clienteId: '3',
    marca: 'Ford',
    modelo: 'Focus',
    año: 2021,
    placa: 'GHI-789',
    vin: '1FADP3F20FL123456',
    color: 'Azul',
    kilometraje: 28000,
    cliente: mockClientes[2],
    createdAt: '2024-01-17T09:45:00Z',
    updatedAt: '2024-01-17T09:45:00Z',
  },
];

export function Vehiculos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const [filterMarca, setFilterMarca] = useState('');

  const filteredVehiculos = mockVehiculos.filter(vehiculo =>
    (vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehiculo.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterMarca === '' || vehiculo.marca === filterMarca)
  );

  const marcas = [...new Set(mockVehiculos.map(v => v.marca))];

  const handleEdit = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedVehiculo(null);
    setShowModal(true);
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
                <p className="text-3xl font-bold text-neutral-900 mt-1">{mockVehiculos.length}</p>
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
                <p className="text-sm font-semibold text-neutral-600">En Taller</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">5</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-warning-500 to-warning-600 shadow-medium">
                <Wrench className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Mantenimiento</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">12</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-medium">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Km Promedio</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">45K</p>
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
                {marcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
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
                            {vehiculo.marca} {vehiculo.modelo}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {vehiculo.año} • {vehiculo.placa}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">
                        {vehiculo.cliente.nombre} {vehiculo.cliente.apellido}
                      </div>
                      <div className="text-sm text-neutral-500">{vehiculo.cliente.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">Color: {vehiculo.color}</div>
                      <div className="text-sm text-neutral-500">VIN: {vehiculo.vin.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-neutral-900">
                        {vehiculo.kilometraje.toLocaleString()} km
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
                        <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600">
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
              <Select label="Cliente" defaultValue={selectedVehiculo?.clienteId}>
                <option value="">Seleccionar cliente</option>
                {mockClientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </Select>
              <Input label="Marca" defaultValue={selectedVehiculo?.marca} />
              <Input label="Modelo" defaultValue={selectedVehiculo?.modelo} />
              <Input label="Año" type="number" defaultValue={selectedVehiculo?.año} />
              <Input label="Placa" defaultValue={selectedVehiculo?.placa} />
              <Input label="Color" defaultValue={selectedVehiculo?.color} />
              <Input label="VIN" defaultValue={selectedVehiculo?.vin} className="md:col-span-2" />
              <Input label="Kilometraje" type="number" defaultValue={selectedVehiculo?.kilometraje} />
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                {selectedVehiculo ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}