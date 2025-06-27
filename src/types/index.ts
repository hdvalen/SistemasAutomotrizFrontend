export interface User {
  id: number;
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
export type UserRol = {
  userId: number;
  rolId: number;
}

export interface Rol {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Client {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birth: string;
  identification: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  serviceOrders?: ServiceOrder;
}

export interface Vehicle {
  id: number;
  clientId: number;
  brand: string;
  model: string;
  vin: string;
  mileage: number;
  typeVehicleId: number;
  client?: Client;
  typeVehicle?: TypeVehicle;
  createdAt: string;
  updatedAt: string;
}
export interface TypeVehicle {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface ServiceOrder {
  id: number;
  VehiclesId: number;
  TypeServiceId: number;
  StateId: number;
  EntryDate: Date;
  ExitDate: Date;
  IsAuthorized: boolean;
  ClientMessage: string;
  UserId: number;
  User?: User;
}

export type EstadoOrden = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface RepuestoOrden {
  id: string;
  ordenId: string;
  repuestoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  SparePart?: SparePart;
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

export interface Invoice {
  id: number;
  ServiceOrderId: number;
  TotalPrice: number;
  Date: Date;
  Code: string;
}

export interface TypeVehicle {
  id: number;
  name: string;
}

export interface SparePart {
  id: number;
  Code: string;
  Description: string;
  Stock: number;
  MaxStock: number;
  MiniStock: number;
  UnitPrice: number;
  Category: string;
}

export interface OrderDetails {
  id: number;
  ServiceOrderId: number;
  SparePartId: number;
  RequiredPieces: number;
  TotalPrice: number;
}