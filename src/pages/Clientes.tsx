import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import type { Client } from '../types';
import { getClient, putClient, deleteClient, postClient } from '../Apis/ClientApis';

export function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Client | null>(null);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [formValues, setFormValues] = useState<Partial<Client>>({});

  useEffect(() => {
    getClient().then((data) => {
      if (data) setClientes(data);
    });
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.phone.includes(searchTerm)
  );

  const handleEdit = (cliente: Client) => {
    setSelectedCliente(cliente);
    setFormValues(cliente);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedCliente(null);
    setFormValues({});
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (selectedCliente) {
      // Edit
      try {
        const response = await putClient(formValues as Client, selectedCliente.id);
  
        if(!response || !response.ok) {
          throw new Error(`Error: revise ordenes de servicio ACTIVAS`);
        }
  
        Swal.fire({
            icon: 'success',
            title: 'Editado',
            text: 'El cliente ha sido editado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
  
        const data = await getClient();
        if (data) setClientes(data);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo editar el cliente, revise ordenes de servicio activas.',
        });
      }
    } else {
      // Create
      await postClient(formValues as Client);
    }
    setShowModal(false);
    // Refresh client list
    const data = await getClient();
    if (data) setClientes(data);
  };

  const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: '¿Esta seguro de eliminar el cliente?',
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
        const response = await deleteClient(id);

        if (!response || !response.ok) {
          throw new Error(`Error: revise ordenes de servicio ACTIVAS`);
        }

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El cliente ha sido eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });

        const data = await getClient();
        if (data) setClientes(data);

      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el cliente, revise ordenes de servicio activas.',
        });
      }
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Gestión de Clientes
          </h1>
          <p className="text-neutral-600 mt-1">Administra la información de tus clientes</p>
        </div>
        <Button onClick={handleCreate} className="shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Lista de Clientes
            </CardTitle>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Fecha de Nacimiento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Identificación
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                          <span className="text-sm font-bold text-white">
                            {cliente.name.charAt(0)}{cliente.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-neutral-900">
                            {cliente.name} {cliente.lastName}
                          </div>
                          <div className="text-sm text-neutral-500">ID: {cliente.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{cliente.email}</div>
                      <div className="text-sm text-neutral-500">{cliente.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{cliente.birth}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {cliente.identification}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)} className="hover:bg-primary-50 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600" onClick={() => handleDelete(cliente.id)}>
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

      {/* Modal placeholder - en una implementación real usarías un modal component */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-strong border border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <div className="space-y-4">
              <Input label="Nombre" name="name" value={formValues.name || ''} onChange={handleInputChange}/>
              <Input label="Apellido" name="lastName" value={formValues.lastName || ''} onChange={handleInputChange}/>
              <Input label="Email" type="email" name="email" value={formValues.email || ''} onChange={handleInputChange}/>
              <Input label="Teléfono" name="phone" value={formValues.phone || ''} onChange={handleInputChange}/>
              <Input label="Identification" name="identification" value={formValues.identification || ''} onChange={handleInputChange}/>
              <Input label="Fecha de Nacimiento" type="date" name="birth" value={formValues.birth || ''} onChange={handleInputChange}/>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {selectedCliente ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}