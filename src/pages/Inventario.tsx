import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { getSpareParts, postSparePart, putSparePart, deleteSparePart } from '../Apis/SparePartApis';
import type { SparePart } from '../types';

export function Inventario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRepuesto, setSelectedRepuesto] = useState<SparePart | null>(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [repuestos, setRepuestos] = useState<SparePart[]>([]);
  const [formValues, setFormValues] = useState<Partial<SparePart>>({});

  useEffect(() => {
    getSpareParts().then((data) => {
      if (data) setRepuestos(data);
    });
  }, []);
  
  const categorias = [...new Set(repuestos.map(r => r.category))];

  const filteredRepuestos = repuestos.filter(repuesto => {
    const matchesSearch = repuesto.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.stock.toString().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filterCategoria === '' || repuesto.category === filterCategoria;
    
    const matchesStock = filterStock === '' || 
                        (filterStock === 'bajo' && repuesto.stock <= repuesto.miniStock) ||
                        (filterStock === 'normal' && repuesto.stock > repuesto.miniStock);
    
    return matchesSearch && matchesCategoria && matchesStock;
  });

  const handleEdit = (repuesto: SparePart) => {
    setSelectedRepuesto(repuesto);
    setFormValues(repuesto);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedRepuesto(null);
    setFormValues({});
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const getInventarioStats = () => {
    const totalItems = repuestos.length;
    const stockBajo = repuestos.filter(r => r.stock <= r.miniStock).length;
    const valorTotal = repuestos.reduce((sum, r) => sum + (r.stock * r.unitPrice), 0);
    const rotacionAlta = repuestos.filter(r => r.stock > r.miniStock * 2).length;
    
    return { totalItems, stockBajo, valorTotal, rotacionAlta };
  };

  const stats = getInventarioStats();

  const handleSubmit = async () => {
    if (selectedRepuesto) {
      //Edit
      await putSparePart(formValues as SparePart, selectedRepuesto.id);

      Swal.fire({
        icon: 'success',
        title: 'Editado',
        text: 'El repuesto ha sido editado exitosamente',
        showConfirmButton: false,
        timer: 1500,
        background: '#1f2937',
        color: '#f9fafb'
      });
    } else {
      //Create
      await postSparePart(formValues as SparePart);
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'El repuesto ha sido creado exitosamente',
        showConfirmButton: false,
        timer: 1500,
        background: '#1f2937',
        color: '#f9fafb'
      });
    }
    setShowModal(false);

    //Refresh
    const data = await getSpareParts();
    if (data) setRepuestos(data);
  };

  const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: '¿Esta seguro de eliminar el repuesto?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#f9fafb'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteSparePart(id);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El repuesto ha sido eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500,
          background: '#1f2937',
          color: '#f9fafb'
        });

        const data = await getSpareParts();
        if (data) setRepuestos(data);

      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el repuesto.',
          background: '#1f2937',
          color: '#f9fafb'
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Gestión de Repuestos
            </h1>
            <p className="text-gray-400 mt-1">Controla el stock de repuestos y materiales</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Repuesto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Total Items</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalItems}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Stock Bajo</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.stockBajo}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Valor Total</p>
                  <p className="text-3xl font-bold text-white mt-1">${(stats.valorTotal / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Alta Rotación</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.rotacionAlta}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                  <TrendingDown className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-white">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Inventario de Repuestos
              </CardTitle>
              <div className="flex space-x-4">
                <Select 
                  value={filterCategoria} 
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </Select>
                <Select 
                  value={filterStock} 
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  <option value="">Todo el stock</option>
                  <option value="bajo">Stock bajo</option>
                  <option value="normal">Stock normal</option>
                </Select>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar repuestos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Repuesto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Precios
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Stock Actual
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredRepuestos.map((repuesto) => (
                    <tr key={repuesto.id} className="hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-white">{repuesto.description}</div>
                            <div className="text-sm text-gray-400">Código: {repuesto.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-blue-900 text-blue-200 border border-blue-700">
                          {repuesto.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-white">{repuesto.stock}</div>
                          {repuesto.stock <= repuesto.miniStock && (
                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">Mín: {repuesto.miniStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          <div>Stock Max: {repuesto.maxStock.toLocaleString()}</div>
                          <div className="font-bold text-white">Venta: ${repuesto.unitPrice.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white"> Stock {repuesto.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(repuesto)} 
                            className="hover:bg-blue-900 hover:text-blue-300 text-gray-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-900 hover:text-red-300 text-gray-400" 
                            onClick={() => handleDelete(repuesto.id)}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-6">
                {selectedRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Código" 
                  name="code" 
                  value={formValues.code || ''} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input 
                  label="Descripción" 
                  name="description" 
                  value={formValues.description || ''} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input 
                  label="Categoria" 
                  name="category" 
                  value={formValues.category || ''} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input 
                  label="Stock Actual" 
                  type="number" 
                  name="stock" 
                  value={formValues.stock || 0} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input 
                  label="Stock Mínimo" 
                  type="number" 
                  name="miniStock" 
                  value={formValues.miniStock || 0} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input 
                  label="Stock Máximo" 
                  type="number" 
                  name="maxStock" 
                  value={formValues.maxStock || 0} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input 
                  label="Precio Compra" 
                  type="number" 
                  name="unitPrice" 
                  value={formValues.unitPrice || 0} 
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {selectedRepuesto ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}