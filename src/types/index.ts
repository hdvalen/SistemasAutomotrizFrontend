export interface User {
  isActive: unknown;
  id: number;
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
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
  vehiclesId: number;
  typeServiceId: number;
  stateId: number;
  entryDate: string;
  exitDate: string;
  isAuthorized: boolean;
  clientMessage: string;
  userId: number;
  user?: User;
  vehicle?: Vehicle;
  invoice?: Invoice;
  state?: State;
  typeService?: TypeService;
}

export interface State {
  id: number;
  name: string;
  serviceOrder?: ServiceOrder;
}

export interface TypeService {
  id: number;
  name: string;
  duration: number;
  price: number;
}
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
  serviceOrder_Id: number;
  totalPrice: number;
  date: string;
  code: string;
  serviceOrder?: ServiceOrder;
}

export interface TypeVehicle {
  id: number;
  name: string;
}
export interface SparePart {
  id: number;
  code: string;
  description: string;
  stock: number;
  maxStock: number;
  miniStock: number;
  unitPrice: number;
  category: string;
}
export interface OrderDetails {
  id: number;
  ServiceOrderId: number;
  SparePartId: number;
  RequiredPieces: number;
  TotalPrice: number;
}

export interface Auditory {
  id: number;
  entityName: string;
  changeType: string;
  changeBy: string;
  user: string;
  date: string;
}

export interface Diagnostic {
  id: number;
  UserId: number;
  User: User;
  Description: string;
  Date: Date;
}

export interface DetailInspection {
  id: number;
  ServiceOrderId: number;
  InspectionId: number;
  Quantity: number;
}

export interface Inspection {
  id: number;
  Name: string;
}

export interface Specialization {
  id: number;
  Name: string;
}

export interface TypeService {
  id: number;
  Name: string;
  Duration: number;
  Price: number;
}
