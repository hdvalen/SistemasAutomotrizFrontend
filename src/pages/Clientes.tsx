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
      try {
        const response = await putClient(formValues as Client, selectedCliente.id);
        if (!response || !response.ok) throw new Error(`Error: revise ordenes de servicio ACTIVAS`);

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
          text: error.message || 'No se pudo editar el cliente.',
        });
      }
    } else {
      await postClient(formValues as Client);
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'El cliente ha sido creado exitosamente',
        showConfirmButton: false,
        timer: 1500
      });
    }
    setShowModal(false);
    const data = await getClient();
    if (data) setClientes(data);
  };

  const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteClient(id);
        if (!response || !response.ok) throw new Error(`Error: revise ordenes de servicio ACTIVAS`);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Cliente eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });

        const data = await getClient();
        if (data) setClientes(data);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el cliente.',
        });
      }
    }
  };

  return (
     <div className="min-h-screen bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
       <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
         <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Gestión de Clientes
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">Administra la información de tus clientes</p>
          </div>
          <Button
        onClick={handleCreate}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="h-5 w-5 mr-2" />
        Nuevo Cliente
      </Button>
        </div>

        {/* Tabla de Clientes */}
        <Card className="bg-zinc-900 border border-zinc-700 shadow-xl">
  <CardHeader className="bg-gradient-to-r to-zinc-700 border-b border-zinc-600">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <CardTitle className="flex items-center text-xl font-bold text-zinc-100">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
        Lista de Clientes
      </CardTitle>
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border-zinc-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg w-full sm:w-64 bg-zinc-800 text-zinc-100 placeholder-zinc-400"
        />
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-0">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-700">
        <thead className="bg-gradient-to-r from-zinc-800 to-zinc-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Contacto</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Nacimiento</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Identificación</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-zinc-900 divide-y divide-zinc-700">
          {filteredClientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-zinc-800 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow">
                    <span className="text-sm font-bold">
                      {cliente.name.charAt(0)}{cliente.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-zinc-100">{cliente.name} {cliente.lastName}</div>
                    <div className="text-sm text-zinc-400">ID: {cliente.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-zinc-100">{cliente.email}</div>
                <div className="text-sm text-zinc-400">{cliente.phone}</div>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-300 whitespace-nowrap">{cliente.birth}</td>
              <td className="px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">{cliente.identification}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-purple-800 text-purple-300">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)} className="hover:bg-indigo-800 text-indigo-300">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente.id)} className="hover:bg-red-800 text-red-300">
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-[0_15px_60px_rgba(0,0,0,0.3)] border border-gray-200 max-h-[90vh] overflow-y-auto transition-all duration-300 scale-100">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nombre" name="name" value={formValues.name || ''} onChange={handleInputChange} />
                <Input label="Apellido" name="lastName" value={formValues.lastName || ''} onChange={handleInputChange} />
                <Input label="Email" type="email" name="email" value={formValues.email || ''} onChange={handleInputChange} />
                <Input label="Teléfono" name="phone" value={formValues.phone || ''} onChange={handleInputChange} />
                <Input label="Identificación" name="identification" value={formValues.identification || ''} onChange={handleInputChange} />
                <Input label="Nacimiento" type="date" name="birth" value={formValues.birth || ''} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                  {selectedCliente ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}