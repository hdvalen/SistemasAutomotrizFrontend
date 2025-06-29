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
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Gestión de Repuestos
            </h1>
            <p className="text-gray-400 mt-1">Controla el stock de repuestos y materiales</p>
          </div>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Repuesto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Total Items</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalItems}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Valor Total</p>
                  <p className="text-3xl font-bold text-white mt-1">${(stats.valorTotal / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
       
        {/*Main Inventory Table*/}
        <Card className="bg-zinc-900 border border-zinc-700 shadow-xl ">
          <CardHeader className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700" >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center text-white">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                Inventario de Repuestos
              </CardTitle>
              <div className="flex space-x-4">
                <Select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </Select>
                <Select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
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
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="">
              <table className="min-w-full divide-y divide-zinc-700">
                <thead className="bg-zinc-800">
                  <tr>
                    {['Repuesto', 'Categoría', 'Stock', 'Precios', 'Stock Actual', 'Acciones'].map((col) => (
                      <th key={col} className="px-6 py-4 text-left text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                  {filteredRepuestos.map((repuesto) => (
                    <tr key={repuesto.id} className="hover:bg-gradient-to-r hover:from-zinc-800 hover:to-zinc-700 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-white">{repuesto.description}</div>
                            <div className="text-sm text-zinc-400">Código: {repuesto.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-purple-900 text-purple-200 border border-purple-700">
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
                        <div className="text-sm text-zinc-400">Mín: {repuesto.miniStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-300">
                          <div>Stock Max: {repuesto.maxStock.toLocaleString()}</div>
                          <div className="font-bold text-white">Venta: ${repuesto.unitPrice.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        Stock {repuesto.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(repuesto)}
                            className="hover:bg-blue-900 hover:text-blue-300 text-zinc-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(repuesto.id)}
                            className="hover:bg-red-900 hover:text-red-300 text-zinc-400"
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
    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
      
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {selectedRepuesto ? 'Editar Repuesto' : 'Nuevo Repuesto'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Código"
          name="code"
          value={formValues.code || ''}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Descripción"
          name="description"
          value={formValues.description || ''}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Categoría"
          name="category"
          value={formValues.category || ''}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Stock Actual"
          type="number"
          name="stock"
          value={formValues.stock || 0}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Stock Mínimo"
          type="number"
          name="miniStock"
          value={formValues.miniStock || 0}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Stock Máximo"
          type="number"
          name="maxStock"
          value={formValues.maxStock || 0}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Input
          label="Precio Compra"
          type="number"
          name="unitPrice"
          value={formValues.unitPrice || 0}
          onChange={handleInputChange}
          className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => setShowModal(false)}
          className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
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