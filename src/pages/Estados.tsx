import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import type { State } from '../types';
import { getState, postState, deleteState, putState } from '../Apis/StateApi';

export function Estados() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedState, setState] = useState<State | null>(null);
    const [estados, setEstados] = useState<State[]>([]);
    const [formValues, setFormValues] = useState<Partial<State>>({});

    useEffect(() => {
        getState().then((data) => {
          if (data) setEstados(data);
        });
    }, []);

    const filteredEstados = estados.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (estado: State) => {
        setState(estado);
        setFormValues(estado);
        setShowModal(true);
    };
    
    const handleCreate = () => {
        setState(null);
        setFormValues({});
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (selectedState) {
            try {
                //Edit
                const response = await putState(formValues as State, selectedState.id);

                if (!response || !response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Editado',
                        text: 'El estado ha sido editado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const data = await getState();
                    if (data) setEstados(data);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Editado',
                    text: 'El estado ha sido editado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error al editar el estado.',
                });
            }
        } else {
            //Create
            await postState(formValues as State);
            Swal.fire({
                icon: 'success',
                title: 'Creado',
                text: 'El estado ha sido creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
        }
        setShowModal(false);

        //Refresh data
        const data = await getState();
        if (data) setEstados(data);
    }

    const handleDelete = async (id: number | string) => {
        const result = await Swal.fire({
            title: '¿Esta seguro de eliminar el estado?',
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
            const response = await deleteState(id);
    
            if (!response || !response.ok) {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el estado.',
            });
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El estado ha sido eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
    
            const data = await getState();
            if (data) setEstados(data);
    
            } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo eliminar el estado.',
            });
            }
        }
    }
    return (
        <div className="min-h-screen bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8 text-zinc-100">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div  className="flex items-center justify-between bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700">
                    <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Gestión de Estados
                    </h1>
                    <p className="text-zinc-400 mt-2 text-lg">Administra la información de los estados de orden</p>
                    </div>
                
                <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Estado
                </Button>
                </div>
                </div>

            {/* Main Table Card */}
            <Card className="bg-zinc-900 border border-zinc-700 shadow-xl mt-8">
                <CardHeader  className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center text-xl font-bold text-white">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        Lista de Estados
                    </CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <Input
                        placeholder="Buscar estados..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-zinc-800 text-white border-zinc-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full sm:w-64"
                        />
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <table className="min-w-full divide-y divide-zinc-500">
                            <thead className="bg-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                            <tbody className="bg-zinc-900 divide-y divide-zinc-800">
  {filteredEstados.map((estado) => (
    <tr
      key={estado.id}
      className="hover:bg-zinc-800 transition-all duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">
              {estado.name.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-zinc-300">ID</div>
            <div className="text-sm text-zinc-400">{estado.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-zinc-100">{estado.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(estado)}
            className="hover:bg-zinc-700 text-zinc-300 hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(estado.id)}
            className="hover:bg-red-600/20 text-red-400 hover:text-red-500"
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

           {showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {selectedState ? 'Editar Estado' : 'Nuevo Estado'}
      </h2>
      <div className="space-y-4">
        <Input
          label="Descripción"
          name="name"
          value={formValues.name || ''}
          onChange={handleInputChange}
          className="bg-white border-gray-300 text-gray-900"
        />
      </div>
      <div className="flex justify-end space-x-3 mt-8">
        <Button
          variant="outline"
          onClick={() => setShowModal(false)}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {selectedState ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </div>
  </div>
)}

        </div>
    );
}