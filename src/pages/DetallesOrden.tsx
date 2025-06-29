import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Eye, Clock, CheckCircle } from 'lucide-react';
import type { ServiceOrder, SparePart, OrderDetails, State, Client, Vehicle } from '../types';
import { getOrderDetails, putOrderDetails, deleteOrderDetails } from '../Apis/OrderDetailsApis';
import { getServiceOrder, generateServiceOrder } from '../Apis/ServiceOrder';
import { getSpareParts } from '../Apis/SparePartApis';
import { getState } from '../Apis/StateApi';
import { getVehicle } from '../Apis/vehiclesApis';
import { getClient } from '../Apis/ClientApis';

export function DetallesOrden() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDetalles, setSelectedDetalles] = useState<OrderDetails | null>(null);
    const [detalles, setDetalles] = useState<OrderDetails[]>([]);
    const [formValues, setFormValues] = useState<Partial<OrderDetails>>({});
    const [repuestos, setRepuestos] = useState<SparePart[]>([]);
    const [ordenes, setOrden] = useState<ServiceOrder[]>([]);
    const [estados, setStates] = useState<State[]>([]);
    const [clientes, setClientes] = useState<Client[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);

    useEffect(() => {
        getClient().then((data) => {
        if (data) setClientes(data);
        });
    }, []);

    useEffect(() => {
          getVehicle().then((data) => {
            if (data) setVehiculos(data);
          });
        }, []);

    useEffect(() => {
        getServiceOrder().then((data) => {
        if (data) setOrden(data);
        });
    }, []);

    useEffect(() => {
        getSpareParts().then((data) => {
        if (data) setRepuestos(data);
        });
    }, []);

    useEffect(() => {
        getOrderDetails().then((data) => {
        if (data) setDetalles(data);
        });
    }, []);

    useEffect(() => {
        getState().then((data) => {
        if (data) setStates(data);
        });
    }, []);

    const handleEdit = (detalles: OrderDetails) => {
        setSelectedDetalles(detalles);
        setFormValues(detalles);
        setShowModal(true);
    };
    
    const handleCreate = () => {
        setSelectedDetalles(null);
        setFormValues({});
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (selectedDetalles) {
            try {
                //Edit
                const response = await putOrderDetails(formValues as OrderDetails, selectedDetalles.id);

                // CORREGIDO: Validación correcta para éxito
                if (response && response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Editado',
                        text: 'El detalle de orden ha sido editado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Refrescar datos solo si fue exitoso
                    const data = await getOrderDetails();
                    if (data) setDetalles(data);
                } else {
                    // Manejar error de respuesta
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al editar el detalle de orden.',
                    });
                }
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error al editar el detalle de orden.',
                });
            }
        } else {
            //Create
            const serviceOrderId = formValues.serviceOrderId;
            if (!serviceOrderId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debes seleccionar una orden de servicio válida.'
                });
                return;
            }

            try {
                const response = await generateServiceOrder(serviceOrderId, formValues as ServiceOrder);
                
                if (!response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Creado',
                        text: 'El detalle de orden ha sido creado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return
                }

                if (response.message) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message
                    });
                    return;
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Creado',
                    text: 'El detalle de orden ha sido creado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                
                const data = await getOrderDetails();
                if (data) setDetalles(data);
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error al crear el detalle de orden.'
                });
            }
        }

        setShowModal(false);
    };

    const getOrdenesCompletadas = () => {
    return ordenes.filter(orden => {
      const estado = estados.find(e => e.id === orden.stateId);
      return estado && (estado.name.toLowerCase().includes('completada') || 
                       estado.name.toLowerCase().includes('terminada') ||
                       estado.name.toLowerCase().includes('finalizada'));
        }).length;
    };

    const getOrdenesPendientes = () => {
        return ordenes.filter(orden => {
        const estado = estados.find(e => e.id === orden.stateId);
        return estado && (estado.name.toLowerCase().includes('pendiente') || 
                        estado.name.toLowerCase().includes('espera') ||
                        estado.name.toLowerCase().includes('nueva'));
        }).length;
    };

    const handleDelete = async (id: number | string) => {
        const result = await Swal.fire({
            title: '¿Esta seguro de eliminar el detaller de orden?',
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
            const response = await deleteOrderDetails(id);
    
            if (!response || !response.ok) {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el detalle de orden.',
            });
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El detalle de orden ha sido eliminado exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
    
            const data = await getOrderDetails();
            if (data) setDetalles(data);
    
            } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo eliminar el detalle de orden.',
            });
            }
        }
    };

    const filteredDetalles = detalles.filter(d => {
    if (!searchTerm) return true; // Si no hay búsqueda, muestra todo
    return (
        d.spareParts?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.spareParts?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    });

    // Función para obtener el vehículo a partir del detalle de orden
    const getVehicleFromOrderDetail = (detalle: OrderDetails): Vehicle | undefined => {
        const orden = ordenes.find(o => o.id === detalle.serviceOrderId);
        if (!orden) return undefined;
        return vehiculos.find(v => v.id === orden.vehiclesId);
    };

    // Función para obtener el cliente a partir del detalle de orden
    const getClientFromOrderDetail = (detalle: OrderDetails): Client | undefined => {
        const orden = ordenes.find(o => o.id === detalle.serviceOrderId);
        if (!orden) return undefined;
        const vehicle = vehiculos.find(v => v.id === orden.vehiclesId);
        if (!vehicle) return undefined;
        return clientes.find(c => c.id === vehicle.clientId);
    };

    const getSparePartName = (sparePartId: number): string => {
        const repuesto = repuestos.find(r => r.id === sparePartId);
        return repuesto ? `${repuesto.description}` : 'N/A'; 
    }

    return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8 text-zinc-100 ">
            <div className="max-w-7xl mx-auto space-y-5">
            {/* header */}
            <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700">
               <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Ordenes de Servicio
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Administra tus ordenes de servicio 
            </p>
          </div>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Detalle de Orden
            </Button>
        </div>
        </div>
        
        {/*stats cards*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className='bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200'>
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Total Detalles de Orden</p>
                    <p className="text-3xl font-bold text-white mt-2">{detalles.length}</p>
                    </div>
                    <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Total Órdenes</p>
                    <p className="text-3xl font-bold text-white mt-1">{ordenes.length}</p>
                    </div>
                    <div className="p-4 rounded-full bg-gradient-to-br from-green-300 to-green-700 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Ordenes Completadas</p>
                    <p className="text-3xl font-bold text-white mt-1">{getOrdenesCompletadas()}</p>
                    </div>
                    <div className="p-4 rounded-full bg-gradient-to-br from-purple-300 to-purple-700 shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Ordenes Pendientes</p>
                    <p className="text-3xl font-bold text-white mt-1">{getOrdenesPendientes()}</p>
                    </div>
                    <div className="p-4 rounded-full bg-gradient-to-br from-red-300 to-red-700 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>

        <Card className='bg-zinc-900 border border-zinc-700 shadow-xl space-y-4 mt-8'>
            <CardHeader className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center text-xl font-bold text-white">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    Lista de Detalles de Orden
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input
                        placeholder="Buscar detalles de orden..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-zinc-800 text-white border-zinc-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full sm:w-64"
                    />
                    </div>
                </div>
                </div>
            </CardHeader>
            <CardContent className='p-0 '>
                <div>
                    <table className="min-w-full divide-y divide-zinc-500 space-y-4">
                        <thead className="bg-zinc-800">
                        <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            Detalle de Orden
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            Cliente / Vehículo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            Repuesto
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            Cantidad
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            Precio Total
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">
                            Acciones
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {filteredDetalles.map((detalle) => {
                            return (
                            <tr key={detalle.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-bold text-neutral-900">{detalle.id}</div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-semibold text-neutral-900">
                                    {getClientFromOrderDetail(detalle)?.name || 'N/A'} {getClientFromOrderDetail(detalle)?.lastName || ''}
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                    {getVehicleFromOrderDetail(detalle)?.brand || ''} • {getVehicleFromOrderDetail(detalle)?.vin || ''}
                                    </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-200 text-neutral-700">
                                    {getSparePartName(detalle.sparePartId)}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-neutral-900">
                                    {detalle.requiredPieces}
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-neutral-900">
                                    {detalle.totalPrice}
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                    <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600" onClick={() => handleEdit(detalle)}>
                                    <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(detalle.id)} className="hover:bg-primary-50 hover:text-primary-600">
                                    <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

        {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-strong border border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                    {selectedDetalles ? 'Editar Detalle' : 'Nuevo Detalle'}
                </h2>
                <div className="space-y-4">
                    <Select label="Orden de Servicio" name="serviceOrderId" value={formValues.serviceOrderId || ''} onChange={e => setFormValues(prev => ({
                            ...prev,
                            serviceOrderId: Number(e.target.value)
                        }))}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                        <option value="">Seleccionar Orden de Servicio</option>
                        {ordenes.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.id} {r.entryDate}
                        </option>
                        ))}
                    </Select>
                    <Input label="Piezas Requeridas" type="number" name="requiredPieces" value={formValues.requiredPieces || ''} onChange={handleInputChange}/>
                    <Select label="Repuesto" name="sparePartId" value={formValues.sparePartId || ''} onChange={e => setFormValues(prev => ({
                            ...prev,
                            sparePartId: Number(e.target.value)
                        }))}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                        <option value="">Seleccionar repuesto</option>
                        {repuestos.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.description}
                        </option>
                        ))}
                    </Select>
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                    {selectedDetalles ? 'Actualizar' : 'Crear'}
                    </Button>
                </div>
                </div>
            </div>
            )}
        </div>
    );
}
