import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { deleteDiagnostic, getDiagnostic, postDiagnostic, putDiagnostic } from '../Apis/DiagnosticApis';
import type { Diagnostic, User } from '../types';
import { getUser } from '../Apis/UserApis';

export function Diagnostico() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDiagnostico, setSelectedDiagnostico] = useState<Diagnostic | null>(null);
    const [diagnosticos, setDiagnostico] = useState<Diagnostic[]>([]);
    const [formValues, setFormValues] = useState<Partial<Diagnostic>>({});
    const [usuarios, setUsuarios] = useState<User[]>([]);

    useEffect(() => {
        getDiagnostic().then((data) => {
          if (data) setDiagnostico(data);
        });
    }, []);

    useEffect(() => {
          getUser().then((data) => {
            if (data) setUsuarios(data);
          });
        }, []);

    const getUserFromDiagnostico = (diagnostico: Diagnostic): User | undefined => {
        const userId = diagnostico.userId;
        if (userId) {
          return usuarios.find(u => u.id === userId);
        }
        return undefined;
    };

    const filteredDiagnostico = diagnosticos.filter(d =>
        d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (diagnostico: Diagnostic) => {
        setSelectedDiagnostico(diagnostico);
        setFormValues(diagnostico);
        setShowModal(true);
    };
    
    const handleCreate = () => {
        setSelectedDiagnostico(null);
        setFormValues({});
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Validación de fecha
        const selectedDate = new Date(formValues.date || '');
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Ignora la hora, solo compara la fecha

        if (selectedDate <= now) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha debe ser posterior a la actual.',
            });
            return;
        }

        if (selectedDiagnostico) {
            try {
                //Edit
                const response = await putDiagnostic(formValues as Diagnostic, selectedDiagnostico.id);

                if (!response || !response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Editado',
                        text: 'El diagnostico ha sido editado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const data = await getDiagnostic();
                    if (data) setDiagnostico(data);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Editado',
                    text: 'El diagnostico ha sido editado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error al editar el diagnóstico.',
                });
            }
        } else {
            //Create
            await postDiagnostic(formValues as Diagnostic);
            Swal.fire({
                icon: 'success',
                title: 'Creado',
                text: 'El diagnostico ha sido creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
        }
        setShowModal(false);

        //Refresh data
        const data = await getDiagnostic();
        if (data) setDiagnostico(data);
    }

    const handleDelete = async (id: number | string) => {
        const result = await Swal.fire({
            title: '¿Esta seguro de eliminar el diagnostico?',
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
            const response = await deleteDiagnostic(id);
    
            if (!response || !response.ok) {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el diagnostico.',
            });
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El diagnostico ha sido eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
    
            const data = await getDiagnostic();
            if (data) setDiagnostico(data);
    
            } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo eliminar el diagnostico.',
            });
            }
        }
    }
    return (
        <div className="min-h-screen bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8 text-zinc-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className='flex items-center justify-between bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700'>
                    <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Gestión de Diagnósticos
                    </h1>
                    <p className="text-zinc-400 mt-2 text-lg">Administra la información de los diagnósticos</p>
                </div>
                
                <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Diagnóstico
                </Button>
                </div>
                </div>
            {/*Main Table Card */}
            <Card className="bg-zinc-900 border border-zinc-700 shadow-xl mt-8">
                <CardHeader className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center text-xl font-bold text-white">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        Lista de Diagnósticos
                    </CardTitle>
                    <div className="relative ">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <Input
                        placeholder="Buscar diagnósticos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-zinc-800 text-white border-zinc-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full sm:w-64"
                        />
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div>
                        <table className="min-w-full divide-y divide-zinc-500">
                            <thead className="bg-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    DESCRIPCION
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    USUARIO
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    FECHA
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                            <tbody className="bg-neutral-900 divide-y divide-neutral-700">
  {filteredDiagnostico.map((diagnostico) => (
    <tr
      key={diagnostico.id}
      className="hover:bg-gradient-to-r hover:from-neutral-800 hover:to-neutral-700 transition-all duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">
              {diagnostico.description.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-white">ID</div>
            <div className="text-sm text-neutral-400">{diagnostico.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white">{diagnostico.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white">
          {getUserFromDiagnostico(diagnostico)?.name || 'N/A'}{' '}
          {getUserFromDiagnostico(diagnostico)?.lastName || ''}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
        {diagnostico.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(diagnostico)}
            className="hover:bg-zinc-700 text-zinc-300 hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(diagnostico.id)}
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
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {selectedDiagnostico ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
      </h2>
      <div className="space-y-4">
        <Input
          label="Descripción"
          name="description"
          value={formValues.description || ''}
          onChange={handleInputChange}
          className="bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Fecha a Agendar"
          type="date"
          name="date"
          value={formValues.date || ''}
          onChange={handleInputChange}
          className="bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Select
          label="Mecánico"
          name="userId"
          value={formValues.userId || ''}
          onChange={e =>
            setFormValues(prev => ({
              ...prev,
              userId: Number(e.target.value)
            }))
          }
          className="w-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        >
          <option value="">Asignar mecánico</option>
          {usuarios.map(mecanico => (
            <option key={mecanico.id} value={mecanico.id}>
              {mecanico.name} {mecanico.lastName}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex justify-end space-x-3 mt-8">
        <Button
          variant="outline"
          onClick={() => setShowModal(false)}
          className="text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow rounded-lg"
        >
          {selectedDiagnostico ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </div>
  </div>
)}

        </div>
    );
}