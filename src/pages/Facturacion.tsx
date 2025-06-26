import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Eye, Download, DollarSign, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { Factura, Cliente, OrdenServicio, EstadoFactura } from '../types';

// Mock data
const mockFacturas: (Factura & { cliente: Cliente; orden: OrdenServicio })[] = [
  {
    id: '1',
    ordenId: 'ORD-001',
    clienteId: '1',
    numero: 'FAC-2024-001',
    fecha: '2024-01-20T16:30:00Z',
    subtotal: 200000,
    impuestos: 38000,
    total: 238000,
    estado: 'pagada',
    metodoPago: 'Efectivo',
    observaciones: 'Pago completo al momento de la entrega',
    cliente: { id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com', telefono: '+1234567890', direccion: 'Calle 123 #45-67', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
    orden: {
      id: 'ORD-001',
      clienteId: '1',
      vehiculoId: '1',
      mecanicoId: '3',
      descripcion: 'Cambio de aceite y filtros',
      estado: 'completada',
      fechaIngreso: '2024-01-20T08:00:00Z',
      costoManoObra: 150000,
      costoRepuestos: 85000,
      costoTotal: 235000,
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-20T16:30:00Z',
    },
    createdAt: '2024-01-20T16:30:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
  },
  {
    id: '2',
    ordenId: 'ORD-002',
    clienteId: '2',
    numero: 'FAC-2024-002',
    fecha: '2024-01-19T17:00:00Z',
    subtotal: 440000,
    impuestos: 83600,
    total: 523600,
    estado: 'pendiente',
    metodoPago: 'Tarjeta de Crédito',
    cliente: { id: '2', nombre: 'María', apellido: 'González', email: 'maria.gonzalez@email.com', telefono: '+1234567891', direccion: 'Avenida 456 #78-90', createdAt: '2024-01-16T11:15:00Z', updatedAt: '2024-01-16T11:15:00Z' },
    orden: {
      id: 'ORD-002',
      clienteId: '2',
      vehiculoId: '2',
      mecanicoId: '4',
      descripcion: 'Reparación de frenos',
      estado: 'completada',
      fechaIngreso: '2024-01-19T09:00:00Z',
      costoManoObra: 200000,
      costoRepuestos: 320000,
      costoTotal: 520000,
      createdAt: '2024-01-19T09:00:00Z',
      updatedAt: '2024-01-19T16:30:00Z',
    },
    createdAt: '2024-01-19T17:00:00Z',
    updatedAt: '2024-01-19T17:00:00Z',
  },
];

const estadoConfig = {
  pendiente: { icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-100', label: 'Pendiente' },
  pagada: { icon: CreditCard, color: 'text-success-600', bg: 'bg-success-100', label: 'Pagada' },
  anulada: { icon: FileText, color: 'text-danger-600', bg: 'bg-danger-100', label: 'Anulada' },
};

export function Facturacion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [filterEstado, setFilterEstado] = useState<EstadoFactura | ''>('');

  const filteredFacturas = mockFacturas.filter(factura =>
    (factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
     factura.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     factura.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
     factura.orden.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterEstado === '' || factura.estado === filterEstado)
  );

  const handleCreate = () => {
    setSelectedFactura(null);
    setShowModal(true);
  };

  const handleViewDetail = (factura: Factura) => {
    setSelectedFactura(factura);
    setShowModal(true);
  };

  const getFacturacionStats = () => {
    const totalFacturas = mockFacturas.length;
    const facturasPendientes = mockFacturas.filter(f => f.estado === 'pendiente').length;
    const ingresosMes = mockFacturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0);
    const facturasPagadas = mockFacturas.filter(f => f.estado === 'pagada').length;
    
    return { totalFacturas, facturasPendientes, ingresosMes, facturasPagadas };
  };

  const stats = getFacturacionStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Sistema de Facturación
          </h1>
          <p className="text-neutral-600 mt-1">Gestiona las facturas y pagos del taller</p>
        </div>
        <Button onClick={handleCreate} className="shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Total Facturas</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalFacturas}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-medium">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Pendientes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.facturasPendientes}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-warning-500 to-warning-600 shadow-medium">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Ingresos Mes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">${(stats.ingresosMes / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-success-500 to-success-600 shadow-medium">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Pagadas</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.facturasPagadas}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 shadow-medium">
                <CreditCard className="h-7 w-7 text-white" />
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
              Lista de Facturas
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value as EstadoFactura | '')}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="pagada">Pagada</option>
                <option value="anulada">Anulada</option>
              </Select>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar facturas..."
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
                    Factura
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredFacturas.map((factura) => {
                  const EstadoIcon = estadoConfig[factura.estado].icon;
                  return (
                    <tr key={factura.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-neutral-900">{factura.numero}</div>
                          <div className="text-sm text-neutral-500">
                            {new Date(factura.fecha).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-neutral-900">
                            {factura.cliente.nombre} {factura.cliente.apellido}
                          </div>
                          <div className="text-sm text-neutral-500">{factura.cliente.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{factura.orden.id}</div>
                        <div className="text-sm text-neutral-500">{factura.orden.descripcion.slice(0, 30)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${estadoConfig[factura.estado].bg} ${estadoConfig[factura.estado].color}`}>
                          <EstadoIcon className="h-3 w-3 mr-1" />
                          {estadoConfig[factura.estado].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-neutral-900">
                          ${factura.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-neutral-500">{factura.metodoPago}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(factura)} className="hover:bg-accent-50 hover:text-accent-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-primary-50 hover:text-primary-600">
                            <Download className="h-4 w-4" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedFactura ? `Factura ${selectedFactura.numero}` : 'Nueva Factura'}
            </h2>
            
            {selectedFactura ? (
              // Vista de detalle de factura
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-4">Información de la Factura</h3>
                    <div className="bg-neutral-50 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Número:</span>
                        <span className="text-sm font-semibold">{selectedFactura.numero}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Fecha:</span>
                        <span className="text-sm font-semibold">{new Date(selectedFactura.fecha).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Estado:</span>
                        <span className={`text-sm font-semibold ${estadoConfig[selectedFactura.estado].color}`}>
                          {estadoConfig[selectedFactura.estado].label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Método de Pago:</span>
                        <span className="text-sm font-semibold">{selectedFactura.metodoPago}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-4">Información del Cliente</h3>
                    <div className="bg-neutral-50 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Nombre:</span>
                        <span className="text-sm font-semibold">{selectedFactura.cliente.nombre} {selectedFactura.cliente.apellido}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Email:</span>
                        <span className="text-sm font-semibold">{selectedFactura.cliente.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Teléfono:</span>
                        <span className="text-sm font-semibold">{selectedFactura.cliente.telefono}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Dirección:</span>
                        <span className="text-sm font-semibold">{selectedFactura.cliente.direccion}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-4">Detalle de Costos</h3>
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Subtotal:</span>
                        <span className="font-semibold">${selectedFactura.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Impuestos (19%):</span>
                        <span className="font-semibold">${selectedFactura.impuestos.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-neutral-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-neutral-900">Total:</span>
                          <span className="text-lg font-bold text-neutral-900">${selectedFactura.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedFactura.observaciones && (
                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-4">Observaciones</h3>
                    <div className="bg-neutral-50 p-4 rounded-xl">
                      <p className="text-sm text-neutral-700">{selectedFactura.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Formulario para nueva factura
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select label="Orden de Servicio">
                  <option value="">Seleccionar orden</option>
                  <option value="ORD-001">ORD-001 - Juan Pérez</option>
                  <option value="ORD-002">ORD-002 - María González</option>
                </Select>
                <Input label="Número de Factura" placeholder="FAC-2024-XXX" />
                <Input label="Fecha" type="date" />
                <Select label="Método de Pago">
                  <option value="">Seleccionar método</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Transferencia">Transferencia</option>
                </Select>
                <Input label="Subtotal" type="number" />
                <Input label="Impuestos" type="number" />
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Observaciones</label>
                  <textarea
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl shadow-soft placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                    rows={3}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                {selectedFactura ? 'Cerrar' : 'Cancelar'}
              </Button>
              {selectedFactura ? (
                <Button>
                  <Download className="h-4 w-4 mr-1" />
                  Descargar PDF
                </Button>
              ) : (
                <Button onClick={() => setShowModal(false)}>
                  Crear Factura
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}