import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Eye, Download, DollarSign, FileText, CreditCard, AlertCircle } from 'lucide-react';
import type { Invoice, Client, ServiceOrder, State, OrderDetails, Vehicle } from '../types';
import { getInvoice, generateInvoice, deleteInvoice } from '../Apis/InvoiceApis';
import { getServiceOrder } from '../Apis/ServiceOrder';
import { getState } from '../Apis/StateApi';
import { getClient } from '../Apis/ClientApis';
import { getOrderDetails } from '../Apis/OrderDetailsApis';
import { getVehicle } from '../Apis/vehiclesApis';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const estadoConfig = {
  pendiente: { icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-100', label: 'Pendiente' },
  pagada: { icon: CreditCard, color: 'text-success-600', bg: 'bg-success-100', label: 'Pagada' },
  anulada: { icon: FileText, color: 'text-danger-600', bg: 'bg-danger-100', label: 'Anulada' },
};

export function Facturacion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Invoice | null>(null);
  const [facturas, setFacturas] = useState<Invoice[]>([]);
  const [formValues, setFormValues] = useState<Partial<Invoice>>({});
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [estados, setEstados] = useState<State[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [ordenes, setOrdenes] = useState<OrderDetails[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [facturaGenerada, setFacturaGenerada] = useState<Invoice | null>(null);
  // Ref para el contenido del modal de factura
  const facturaModalRef = React.useRef<HTMLDivElement>(null);

  // Cargar todos los datos al inicializar el componente
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        // Cargar datos en paralelo
        const [invoicesData, serviceOrdersData, statesData, clientsData, ordersData, vehiclesData] = await Promise.all([
          getInvoice(),
          getServiceOrder(),
          getState(),
          getClient(),
          getOrderDetails(),
          getVehicle()
        ]);

        if (invoicesData) setFacturas(invoicesData);
        if (serviceOrdersData) setServiceOrders(serviceOrdersData);
        if (statesData) setEstados(statesData);
        if (clientsData) setClientes(clientsData);
        if (ordersData) setOrdenes(ordersData);
        if (vehiclesData) setVehiculos(vehiclesData);

        console.log('Datos cargados:', {
          facturas: invoicesData?.length || 0,
          serviceOrders: serviceOrdersData?.length || 0,
          clientes: clientsData?.length || 0,
          vehiculos: vehiclesData?.length || 0
        });

        // Debug adicional: mostrar una factura de ejemplo y sus relaciones
        if (invoicesData && invoicesData.length > 0) {
          const primeraFactura = invoicesData[0];
          console.log('Primera factura:', primeraFactura);
          console.log('¿Tiene serviceOrder poblado?', !!primeraFactura.serviceOrder);
          
          if (serviceOrdersData && serviceOrdersData.length > 0) {
            const serviceOrderEjemplo = serviceOrdersData[0];
            console.log('Primera service order:', serviceOrderEjemplo);
            console.log('¿Tiene vehicle poblado?', !!serviceOrderEjemplo.vehicle);
          }
          
          if (vehiclesData && vehiclesData.length > 0) {
            const vehiculoEjemplo = vehiclesData[0];
            console.log('Primer vehículo:', vehiculoEjemplo);
            console.log('¿Tiene client poblado?', !!vehiculoEjemplo.client);
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
        Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Función para obtener la orden de servicio desde la factura
  const getServiceOrderFromInvoice = (factura: Invoice): ServiceOrder | undefined => {
    // Validar que serviceOrder_Id sea válido
    if (!factura.serviceOrder_Id || factura.serviceOrder_Id === 0) {
      return undefined;
    }
    
    // Buscar la orden de servicio por ID en el array de service orders
    return serviceOrders.find(so => so.id === factura.serviceOrder_Id);
  };

  // Función para obtener el vehículo desde la orden de servicio
  const getVehicleFromServiceOrder = (serviceOrder: ServiceOrder): Vehicle | undefined => {
    // Buscar el vehículo por vehiclesId en el array de vehículos
    return vehiculos.find(v => v.id === serviceOrder.vehiclesId);
  };

  // Función para obtener el cliente desde el vehículo
  const getClientFromVehicle = (vehicle: Vehicle): Client | undefined => {
    // Buscar el cliente por clientId en el array de clientes
    return clientes.find(c => c.id === vehicle.clientId);
  };

  const getEstadoFactura = (factura: Invoice) => {
    const serviceOrder = getServiceOrderFromInvoice(factura);
    if (!serviceOrder) return 'pendiente';
    
    const estado = estados.find(e => e.id === serviceOrder.stateId);
    return estado ? estado.name.toLowerCase() : 'pendiente';
  };

  // Función para obtener información completa de la factura
  const getFacturaCompleteInfo = (factura: Invoice) => {
    // Paso 1: Obtener la orden de servicio desde la factura
    const serviceOrder = getServiceOrderFromInvoice(factura);
    
    // Paso 2: Obtener el vehículo desde la orden de servicio
    const vehicle = serviceOrder ? getVehicleFromServiceOrder(serviceOrder) : undefined;
    
    // Paso 3: Obtener el cliente desde el vehículo
    const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
    
    // Determinar si la factura tiene datos válidos
    const hasValidData = !!serviceOrder && !!vehicle && !!client;
    
    return {
      serviceOrder,
      vehicle,
      client,
      clientName: client ? `${client.name} ${client.lastName}` : (hasValidData ? 'N/A' : 'Sin datos'),
      clientEmail: client?.email || (hasValidData ? 'N/A' : 'Sin datos'),
      clientPhone: client?.telephoneNumbers?.map(t => t.number).join(', ') || (hasValidData ? 'N/A' : 'Sin datos'),
      vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model}` : (hasValidData ? 'N/A' : 'Sin datos'),
      vehicleVin: vehicle?.vin || (hasValidData ? 'N/A' : 'Sin datos'),
      hasValidData,
      status: hasValidData ? 'valid' : factura.serviceOrder_Id === 0 ? 'no-relation' : 'missing-data'
    };
  };

  const filteredFacturas = facturas.filter(factura => {
    const { vehicleInfo, clientName } = getFacturaCompleteInfo(factura);
    
    const matchesSearch = searchTerm === '' || 
      factura.totalPrice.toString().includes(searchTerm.toLowerCase()) ||
      factura.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (factura.code && factura.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEstado = filterEstado === '' || getEstadoFactura(factura) === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  // Función para obtener órdenes de servicio que NO tienen factura
  const getServiceOrdersWithoutInvoice = (): ServiceOrder[] => {
    return serviceOrders.filter(so => !facturas.find(f => f.serviceOrder_Id === so.id));
  };

  // Función para generar factura automáticamente
  const generateInvoiceFromServiceOrder = async (serviceOrder: ServiceOrder) => {
    try {
      // Obtener información del vehículo y cliente para mostrar en el log
      const vehicle = getVehicleFromServiceOrder(serviceOrder);
      const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
      
      console.log('Generando factura para service order:', serviceOrder.id);
      if (client && vehicle) {
        console.log('Cliente:', client.name, client.lastName);
        console.log('Vehículo:', vehicle.brand, vehicle.model);
      }
      
      // Llamada a la API - solo enviamos el ID de la orden de servicio
      const response = await generateInvoice(serviceOrder.id);
      
      if (response && response.id) {
        Swal.fire('Éxito', 'Factura generada correctamente', 'success');
        // Recargar los datos
        const newInvoicesData = await getInvoice();
        if (newInvoicesData) setFacturas(newInvoicesData);
        // Buscar la factura recién creada por id
        const nuevaFactura = newInvoicesData?.find(f => f.id === response.id);
        setFacturaGenerada(nuevaFactura || null);
      } else {
        Swal.fire('Error', 'No se encontraron ordenes relacionadas con la factura', 'error');
      }
      
    } catch (error) {
      console.error('Error generando factura:', error);
      Swal.fire('Error', 'No se encontraron ordenes relacionadas con la factura', 'error');
    }
  };

  // Función para cerrar el modal de factura generada
  const cerrarModalFactura = () => setFacturaGenerada(null);

  // Función de debug para verificar el estado de los datos
  const debugDataStatus = () => {
    console.log('=== ESTADO DE LOS DATOS ===');
    console.log('Facturas totales:', facturas.length);
    console.log('Service Orders totales:', serviceOrders.length);
    console.log('Vehículos totales:', vehiculos.length);
    console.log('Clientes totales:', clientes.length);
    
    // Analizar facturas
    const facturasValidas = facturas.filter(f => f.serviceOrder_Id && f.serviceOrder_Id > 0);
    const facturasInvalidas = facturas.filter(f => !f.serviceOrder_Id || f.serviceOrder_Id === 0);
    
    console.log('\n=== ANÁLISIS DE FACTURAS ===');
    console.log('Facturas válidas (con serviceOrder_Id > 0):', facturasValidas.length);
    console.log('Facturas inválidas (serviceOrder_Id = 0 o null):', facturasInvalidas.length);
    
    // Analizar órdenes sin factura
    const ordenesSinFactura = getServiceOrdersWithoutInvoice();
    console.log('Órdenes de servicio sin factura:', ordenesSinFactura.length);
    
    // Mostrar ejemplos de datos válidos
    if (serviceOrders.length > 0 && vehiculos.length > 0 && clientes.length > 0) {
      const ejemploServiceOrder = serviceOrders[0];
      const ejemploVehicle = vehiculos[0];
      const ejemploClient = clientes[0];
      
      console.log('\n=== EJEMPLO DE DATOS VÁLIDOS ===');
      console.log('Service Order ejemplo:', {
        id: ejemploServiceOrder.id,
        vehiclesId: ejemploServiceOrder.vehiclesId,
        stateId: ejemploServiceOrder.stateId
      });
      
      console.log('Vehículo ejemplo:', {
        id: ejemploVehicle.id,
        clientId: ejemploVehicle.clientId,
        brand: ejemploVehicle.brand,
        model: ejemploVehicle.model
      });
      
      console.log('Cliente ejemplo:', {
        id: ejemploClient.id,
        name: ejemploClient.name,
        lastName: ejemploClient.lastName
      });
      
      // Probar rastreo con datos válidos
      const vehicle = getVehicleFromServiceOrder(ejemploServiceOrder);
      const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
      
      console.log('\n=== PRUEBA DE RASTREO ===');
      console.log('Service Order ID:', ejemploServiceOrder.id);
      console.log('Vehicle encontrado:', vehicle ? `${vehicle.brand} ${vehicle.model}` : 'NO');
      console.log('Client encontrado:', client ? `${client.name} ${client.lastName}` : 'NO');
    }
  };

  // Función para regenerar facturas inválidas
  const regenerateInvalidInvoices = async () => {
    const facturasInvalidas = facturas.filter(f => !f.serviceOrder_Id || f.serviceOrder_Id === 0);
    
    if (facturasInvalidas.length === 0) {
      Swal.fire('Info', 'No hay facturas inválidas para regenerar', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Regenerar Facturas',
      text: `Se encontraron ${facturasInvalidas.length} facturas sin orden de servicio válida. ¿Deseas generar nuevas facturas desde órdenes de servicio disponibles?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, regenerar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Mostrar modal con órdenes disponibles
      setFormValues({});
      setShowModal(true);
    }
  };

  const handleCreate = () => {
    const ordenesSinFactura = getServiceOrdersWithoutInvoice();
    
    if (ordenesSinFactura.length === 0) {
      Swal.fire('Info', 'Todas las órdenes de servicio ya tienen factura', 'info');
      return;
    }

    // Mostrar modal con órdenes disponibles
    setFormValues({});
    setShowModal(true);
  };

  const handleViewDetail = (factura: Invoice) => {
    setSelectedFactura(factura);
    setShowModal(true);
  };

  // Función de debug para verificar el rastreo paso a paso
  const debugTracing = () => {
    console.log('=== DEBUG RASTREO PASO A PASO ===');
    console.log('Datos disponibles:');
    console.log('- Facturas:', facturas.length);
    console.log('- Service Orders:', serviceOrders.length);
    console.log('- Vehículos:', vehiculos.length);
    console.log('- Clientes:', clientes.length);
    
    if (facturas.length > 0) {
      const factura = facturas[0];
      console.log('\n--- Rastreo para factura ID:', factura.id, '---');
      console.log('1. Factura serviceOrder_Id:', factura.serviceOrder_Id);
      
      // Paso 1: Buscar Service Order
      const serviceOrder = getServiceOrderFromInvoice(factura);
      console.log('2. Service Order encontrada:', serviceOrder ? `ID: ${serviceOrder.id}` : 'NO ENCONTRADA');
      
      if (serviceOrder) {
        // Paso 2: Buscar Vehicle
        const vehicle = getVehicleFromServiceOrder(serviceOrder);
        console.log('3. Vehicle encontrado:', vehicle ? `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.id})` : 'NO ENCONTRADO');
        
        if (vehicle) {
          // Paso 3: Buscar Client
          const client = getClientFromVehicle(vehicle);
          console.log('4. Client encontrado:', client ? `${client.name} ${client.lastName} (ID: ${client.id})` : 'NO ENCONTRADO');
        }
      }
    }
  };

  const getFacturacionStats = () => {
    const totalFacturas = facturas.length;
    const facturasValidas = facturas.filter(f => f.serviceOrder_Id && f.serviceOrder_Id > 0);
    const facturasInvalidas = facturas.filter(f => !f.serviceOrder_Id || f.serviceOrder_Id === 0);
    const ordenesSinFactura = getServiceOrdersWithoutInvoice();
    const montoTotal = facturasValidas.reduce((acc, factura) => acc + factura.totalPrice, 0);
    
    return { 
      totalFacturas, 
      facturasValidas: facturasValidas.length,
      facturasInvalidas: facturasInvalidas.length,
      ordenesSinFactura: ordenesSinFactura.length,
      montoTotal 
    };
  };

  const stats = getFacturacionStats();

  // Cambiar la fuente de datos de la tabla: solo órdenes sin factura
  const ordenesPendientesFacturar = getServiceOrdersWithoutInvoice();

  // Función para descargar el PDF del modal de factura
  const handleDownloadPDF = async () => {
    const input = facturaModalRef.current;
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Ajustar la imagen al ancho de la página
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('factura.pdf');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-neutral-600">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div>
      <div >
        {/* Header */}
        <div className='space-y-4 mb-8 shadow-xl bg'>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Sistema de Facturación
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">Órdenes de servicio pendientes de facturar</p>
          </div>
        </div>
      </div>

      <Card className='bg-zinc-800 border border-zinc-700 shadow-xl  '>
        <CardHeader className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center text-xl font-bold text-white">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              Órdenes Pendientes de Facturar
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}
                className="bg-zinc-800 border-zinc-600 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500">
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.name.toLowerCase()}>{estado.name}</option>
                ))}
              </Select>
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-zinc-800 text-white border-zinc-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            <table className="min-w-full divide-y divide-zinc-500">
              <thead className="bg-zinc-800"> 
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Orden de Servicio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Cliente / Vehículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Fecha Entrada
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-800">
  {ordenesPendientesFacturar
    .filter(so => {
      const estado = estados.find(e => e.id === so.stateId)?.name.toLowerCase() || '';
      const vehicle = getVehicleFromServiceOrder(so);
      const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
      const search = searchTerm.toLowerCase();
      return (
        (!filterEstado || estado === filterEstado) &&
        (
          so.id.toString().includes(search) ||
          (vehicle && `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(search)) ||
          (client && `${client.name} ${client.lastName}`.toLowerCase().includes(search))
        )
      );
    })
    .map((so) => {
      const vehicle = getVehicleFromServiceOrder(so);
      const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
      const estado = estados.find(e => e.id === so.stateId)?.name || 'N/A';
      return (
        <tr
          key={so.id}
          className="hover:bg-zinc-800 transition-all duration-200"
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-bold text-zinc-100">#{so.id}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-semibold text-zinc-100">
              {client ? `${client.name} ${client.lastName}` : 'Sin datos'}
            </div>
            <div className="text-sm text-zinc-400">
              {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Sin datos'}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-zinc-700 text-zinc-200">
              {estado}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-zinc-300">
              {new Date(so.entryDate).toLocaleDateString('es-ES')}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <Button
              size="sm"
              onClick={() => generateInvoiceFromServiceOrder(so)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Generar Factura</span>
            </Button>
          </td>
        </tr>
      );
    })}
</tbody>

            </table>
          </div>
          {ordenesPendientesFacturar.length === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-500">No hay órdenes pendientes de facturar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div ref={facturaModalRef} className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            
            {selectedFactura ? (
              // Vista de detalle de factura
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">Detalle de Factura</h2>
                  <p className="text-neutral-600">Información completa de la factura</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-4">Información de la Factura</h3>
                    <div className="bg-neutral-50 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">ID:</span>
                        <span className="text-sm font-semibold">{selectedFactura.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Código:</span>
                        <span className="text-sm font-semibold">{selectedFactura.code || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Fecha:</span>
                        <span className="text-sm font-semibold">{new Date(selectedFactura.date).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Estado:</span>
                        <span className="text-sm font-semibold capitalize">
                          {getEstadoFactura(selectedFactura)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Service Order ID:</span>
                        <span className="text-sm font-semibold">{selectedFactura.serviceOrder_Id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-4">Información del Cliente</h3>
                    {(() => {
                      const { client, clientName, clientEmail, clientPhone } = getFacturaCompleteInfo(selectedFactura);
                      return (
                        <div className="bg-neutral-50 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Nombre:</span>
                            <span className="text-sm font-semibold">{clientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Email:</span>
                            <span className="text-sm font-semibold">{clientEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600">Teléfono:</span>
                            <span className="text-sm font-semibold">{clientPhone}</span>
                          </div>
                          {client && (
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">ID Cliente:</span>
                              <span className="text-sm font-semibold">{client.id}</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-4">Información del Vehículo</h3>
                  {(() => {
                    const { vehicle, vehicleInfo, vehicleVin } = getFacturaCompleteInfo(selectedFactura);
                    return (
                      <div className="bg-neutral-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Vehículo:</span>
                          <span className="text-sm font-semibold">{vehicleInfo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">VIN:</span>
                          <span className="text-sm font-semibold">{vehicleVin}</span>
                        </div>
                        {vehicle && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">ID Vehículo:</span>
                              <span className="text-sm font-semibold">{vehicle.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">VIN:</span>
                              <span className="text-sm font-semibold">{vehicle.vin || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-neutral-600">MODEL:</span>
                              <span className="text-sm font-semibold">{vehicle.model || 'N/A'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-4">Detalle de Costos</h3>
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <div className="border-t border-neutral-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-neutral-900">Total:</span>
                        <span className="text-lg font-bold text-neutral-900">${selectedFactura.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            ) : (
              // Formulario para nueva factura
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">Generar Factura</h2>
                  <p className="text-neutral-600">Selecciona una orden de servicio para generar su factura</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-700">Órdenes de Servicio Disponibles</h3>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {getServiceOrdersWithoutInvoice().map(serviceOrder => {
                      const vehicle = getVehicleFromServiceOrder(serviceOrder);
                      const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
                      const estado = estados.find(e => e.id === serviceOrder.stateId);
                      
                      return (
                        <div 
                          key={serviceOrder.id} 
                          className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                          onClick={() => generateInvoiceFromServiceOrder(serviceOrder)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-900">
                                Orden #{serviceOrder.id}
                              </h4>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-neutral-600">
                                  <span className="font-medium">Cliente:</span> {client ? `${client.name} ${client.lastName}` : 'N/A'}
                                </p>
                                <p className="text-sm text-neutral-600">
                                  <span className="font-medium">Vehículo:</span> {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}
                                </p>
                                <p className="text-sm text-neutral-600">
                                  <span className="font-medium">Estado:</span> {estado ? estado.name : 'N/A'}
                                </p>
                                <p className="text-sm text-neutral-600">
                                  <span className="font-medium">Fecha entrada:</span> {new Date(serviceOrder.entryDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                Generar Factura
                              </span>
                              <div className="mt-2">
                                <span className="text-xs text-neutral-500">Click para generar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {getServiceOrdersWithoutInvoice().length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <p>Todas las órdenes de servicio ya tienen factura</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                {selectedFactura ? 'Cerrar' : 'Cancelar'}
              </Button>
              {selectedFactura ? (
                <Button onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-1" />
                  Descargar PDF
                </Button>
              ) : (
                <Button onClick={() => {
                  console.log('Crear factura:', formValues);
                  setShowModal(false);
                }}>
                  Crear Factura
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de factura generada */}
      {facturaGenerada && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div ref={facturaModalRef} className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-zinc-800">Factura Generada</h2>
                <p className="text-zinc-500">Información básica de la factura</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-700">ID:</span>
                  <span className="text-sm font-semibold text-zinc-800">{facturaGenerada.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-700">Código:</span>
                  <span className="text-sm font-semibold text-zinc-800">{facturaGenerada.code || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-700">Fecha:</span>
                  <span className="text-sm font-semibold text-zinc-800">{new Date(facturaGenerada.date).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-700">Total:</span>
                  <span className="text-sm font-semibold text-zinc-800">${facturaGenerada.totalPrice.toLocaleString()}</span>
                </div>
                {/* Cliente y vehículo */}
                {(() => {
                  const serviceOrder = getServiceOrderFromInvoice(facturaGenerada);
                  const vehicle = serviceOrder ? getVehicleFromServiceOrder(serviceOrder) : undefined;
                  const client = vehicle ? getClientFromVehicle(vehicle) : undefined;
                  return (
                    <>
                      {/* <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Cliente:</span>
                        <span className="text-sm font-semibold">{client ? `${client.name} ${client.lastName}` : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Vehículo:</span>
                        <span className="text-sm font-semibold">{vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A'}</span>
                      </div> */}
                    </>
                  );
                })()}
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <Button variant="outline" onClick={cerrarModalFactura}>
                  Salir
                </Button>
                <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}