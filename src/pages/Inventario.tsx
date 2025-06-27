import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { Repuesto } from '../types';

// Mock data
const mockRepuestos: Repuesto[] = [
  {
    id: '1',
    codigo: 'FLT-001',
    nombre: 'Filtro de Aceite Toyota',
    descripcion: 'Filtro de aceite compatible con motores Toyota 1.6L y 1.8L',
    categoria: 'Filtros',
    proveedor: 'AutoPartes SA',
    stock: 25,
    stockMinimo: 10,
    precioCompra: 15000,
    precioVenta: 25000,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    codigo: 'BRK-002',
    nombre: 'Pastillas de Freno Delanteras',
    descripcion: 'Pastillas de freno cerámicas para vehículos compactos',
    categoria: 'Frenos',
    proveedor: 'Frenos Premium',
    stock: 8,
    stockMinimo: 15,
    precioCompra: 85000,
    precioVenta: 140000,
    createdAt: '2024-01-16T11:15:00Z',
    updatedAt: '2024-01-16T11:15:00Z',
  },
  {
    id: '3',
    codigo: 'OIL-003',
    nombre: 'Aceite Motor 5W-30 Sintético',
    descripcion: 'Aceite sintético premium para motores modernos',
    categoria: 'Lubricantes',
    proveedor: 'Lubricantes Pro',
    stock: 45,
    stockMinimo: 20,
    precioCompra: 35000,
    precioVenta: 55000,
    createdAt: '2024-01-17T09:45:00Z',
    updatedAt: '2024-01-17T09:45:00Z',
  },
  {
    id: '4',
    codigo: 'SPK-004',
    nombre: 'Bujías NGK Iridium',
    descripcion: 'Bujías de iridio de alta durabilidad',
    categoria: 'Encendido',
    proveedor: 'Repuestos Eléctricos',
    stock: 3,
    stockMinimo: 12,
    precioCompra: 25000,
    precioVenta: 40000,
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
  },
];

const categorias = [...new Set(mockRepuestos.map(r => r.categoria))];

export function Inventario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRepuesto, setSelectedRepuesto] = useState<Repuesto | null>(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStock, setFilterStock] = useState('');

  const filteredRepuestos = mockRepuestos.filter(repuesto => {
    const matchesSearch = repuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repuesto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repuesto.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filterCategoria === '' || repuesto.categoria === filterCategoria;
    
    const matchesStock = filterStock === '' || 
                        (filterStock === 'bajo' && repuesto.stock <= repuesto.stockMinimo) ||
                        (filterStock === 'normal' && repuesto.stock > repuesto.stockMinimo);
    
    return matchesSearch && matchesCategoria && matchesStock;
  });

  const handleEdit = (repuesto: Repuesto) => {
    setSelectedRepuesto(repuesto);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedRepuesto(null);
    setShowModal(true);
  };

  const getInventarioStats = () => {
    const totalItems = mockRepuestos.length;
    const stockBajo = mockRepuestos.filter(r => r.stock <= r.stockMinimo).length;
    const valorTotal = mockRepuestos.reduce((sum, r) => sum + (r.stock * r.precioCompra), 0);
    const rotacionAlta = mockRepuestos.filter(r => r.stock > r.stockMinimo * 2).length;
    
    return { totalItems, stockBajo, valorTotal, rotacionAlta };
  };

  const stats = getInventarioStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Gestión de Inventario
          </h1>
          <p className="text-neutral-600 mt-1">Controla el stock de repuestos y materiales</p>
        </div>
        <Button onClick={handleCreate} className="shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Repuesto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Total Items</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalItems}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-medium">
                <Package className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Stock Bajo</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.stockBajo}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-danger-500 to-danger-600 shadow-medium">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Valor Total</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">${(stats.valorTotal / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-success-500 to-success-600 shadow-medium">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Alta Rotación</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.rotacionAlta}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-medium">
                <TrendingDown className="h-7 w-7 text-white" />
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
              Inventario de Repuestos
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </Select>
              <Select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
                <option value="">Todo el stock</option>
                <option value="bajo">Stock bajo</option>
                <option value="normal">Stock normal</option>
              </Select>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar repuestos..."
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
                    Repuesto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Precios
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredRepuestos.map((repuesto) => (
                  <tr key={repuesto.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-neutral-900">{repuesto.nombre}</div>
                          <div className="text-sm text-neutral-500">Código: {repuesto.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-accent-100 text-accent-800">
                        {repuesto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-bold text-neutral-900">{repuesto.stock}</div>
                        {repuesto.stock <= repuesto.stockMinimo && (
                          <AlertTriangle className="h-4 w-4 text-danger-500 ml-2" />
                        )}
                      </div>
                      <div className="text-sm text-neutral-500">Mín: {repuesto.stockMinimo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        <div>Compra: ${repuesto.precioCompra.toLocaleString()}</div>
                        <div className="font-bold">Venta: ${repuesto.precioVenta.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{repuesto.proveedor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(repuesto)} className="hover:bg-primary-50 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Código" defaultValue={selectedRepuesto?.codigo} />
              <Input label="Nombre" defaultValue={selectedRepuesto?.nombre} />
              <Select label="Categoría" defaultValue={selectedRepuesto?.categoria}>
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </Select>
              <Input label="Proveedor" defaultValue={selectedRepuesto?.proveedor} />
              <Input label="Stock Actual" type="number" defaultValue={selectedRepuesto?.stock} />
              <Input label="Stock Mínimo" type="number" defaultValue={selectedRepuesto?.stockMinimo} />
              <Input label="Precio Compra" type="number" defaultValue={selectedRepuesto?.precioCompra} />
              <Input label="Precio Venta" type="number" defaultValue={selectedRepuesto?.precioVenta} />
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Descripción</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl shadow-soft placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200"
                  rows={3}
                  defaultValue={selectedRepuesto?.descripcion}
                  placeholder="Descripción detallada del repuesto..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                {selectedRepuesto ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}