export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'administrador' | 'recepcionista' | 'mecanico';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehiculo {
  id: string;
  clienteId: string;
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  vin: string;
  color: string;
  kilometraje: number;
  cliente?: Cliente;
  createdAt: string;
  updatedAt: string;
}

export interface OrdenServicio {
  id: string;
  clienteId: string;
  vehiculoId: string;
  mecanicoId: string;
  descripcion: string;
  estado: EstadoOrden;
  fechaIngreso: string;
  fechaEstimada?: string;
  fechaEntrega?: string;
  costoManoObra: number;
  costoRepuestos: number;
  costoTotal: number;
  observaciones?: string;
  cliente?: Cliente;
  vehiculo?: Vehiculo;
  mecanico?: User;
  repuestos?: RepuestoOrden[];
  createdAt: string;
  updatedAt: string;
}

export type EstadoOrden = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface Repuesto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  proveedor: string;
  stock: number;
  stockMinimo: number;
  precioCompra: number;
  precioVenta: number;
  createdAt: string;
  updatedAt: string;
}

export interface RepuestoOrden {
  id: string;
  ordenId: string;
  repuestoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  repuesto?: Repuesto;
}

export interface Factura {
  id: string;
  ordenId: string;
  clienteId: string;
  numero: string;
  fecha: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: EstadoFactura;
  metodoPago: string;
  observaciones?: string;
  orden?: OrdenServicio;
  cliente?: Cliente;
  createdAt: string;
  updatedAt: string;
}

export type EstadoFactura = 'pendiente' | 'pagada' | 'anulada';

export interface DashboardStats {
  totalOrdenes: number;
  ordenesPendientes: number;
  ordenesEnProceso: number;
  ordenesCompletadas: number;
  ingresosMes: number;
  clientesActivos: number;
  vehiculosEnTaller: number;
  repuestosBajoStock: number;
}