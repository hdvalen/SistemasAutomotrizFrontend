import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { getTypeService, postTypeService, putTypeService, deleteTypeService } from '../Apis/TypeServiceApis';
import type { TypeService } from '../types';

export function TipodeServicio() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState<TypeService | null>(null);
    const [servicios, setServicio] = useState<TypeService[]>([]);
    const [formValues, setFormValues] = useState<Partial<TypeService>>({});

    useEffect(() => {
        getTypeService().then((data) => {
          if (data) setServicio(data);
        });
    }, []);

    const filteredServices = servicios.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (servicio: TypeService) => {
        setSelectedServicio(servicio);
        setFormValues(servicio);
        setShowModal(true);
    };
    
    const handleCreate = () => {
        setSelectedServicio(null);
        setFormValues({});
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (selectedServicio) {
            try {
                //Edit
                const response = await putTypeService(formValues as TypeService, selectedServicio.id);

                if (!response || !response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Editado',
                        text: 'El servicio ha sido editado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const data = await getTypeService();
                    if (data) setServicio(data);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Editado',
                    text: 'El servicio ha sido editado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error al editar el servicio.',
                });
            }
        } else {
            //Create
            await postTypeService(formValues as TypeService);
            Swal.fire({
                icon: 'success',
                title: 'Creado',
                text: 'El servicio ha sido creado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
        }
        setShowModal(false);

        //Refresh data
        const data = await getTypeService();
        if (data) setServicio(data);
    }

    const handleDelete = async (id: number | string) => {
        const result = await Swal.fire({
            title: '¿Esta seguro de eliminar el servicio?',
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
            const response = await deleteTypeService(id);
    
            if (!response || !response.ok) {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el servicio.',
            });
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El servicio ha sido eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
    
            const data = await getTypeService();
            if (data) setServicio(data);
    
            } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo eliminar el servicio.',
            });
            }
        }
    }
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                    Gestión de Servicios
                    </h1>
                    <p className="text-neutral-600 mt-1">Administra la información de los servicios</p>
                </div>
                <Button onClick={handleCreate} className="shadow-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Servicio
                </Button>
                </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        Lista de Servicios
                    </CardTitle>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                        placeholder="Buscar servicios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div >
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                    Duración
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {filteredServices.map((servicio) => (
                                    <tr key={servicio.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                                            <span className="text-sm font-bold text-white">
                                            {servicio.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-neutral-900">
                                            ID
                                            </div>
                                            <div className="text-sm text-neutral-500">{servicio.id}</div>
                                        </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">{servicio.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">{servicio.price}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {servicio.duration}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                        <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(servicio)} className="hover:bg-primary-50 hover:text-primary-600">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600" onClick={() => handleDelete(servicio.id)}>
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-strong border border-neutral-200">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">
                        {selectedServicio ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
                    </h2>
                    <div className="space-y-4">
                        <Input label="Descripción" name="name" value={formValues.name || ''} onChange={handleInputChange}/>
                        <Input label="Precio" type="number" name="price" value={formValues.price || ''} onChange={handleInputChange}/>
                        <Input label="Duración" type="number" name="duration" value={formValues.duration || ''} onChange={handleInputChange}/>
                    </div>
                    <div className="flex justify-end space-x-3 mt-8">
                        <Button variant="outline" onClick={() => setShowModal(false)}>
                        Cancelar
                        </Button>
                        <Button onClick={handleSubmit}>
                        {selectedServicio ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                    </div>
                </div>
                )}
        </div>
    );
}