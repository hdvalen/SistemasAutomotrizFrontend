import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX, Shield } from 'lucide-react';
import { User, UserRole } from '../types';

// Mock data
const mockUsuarios: User[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'admin@autotaller.com',
    telefono: '+1234567890',
    rol: 'administrador',
    activo: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nombre: 'María González',
    email: 'recepcionista@autotaller.com',
    telefono: '+1234567891',
    rol: 'recepcionista',
    activo: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    email: 'mecanico@autotaller.com',
    telefono: '+1234567892',
    rol: 'mecanico',
    activo: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    email: 'ana.martinez@autotaller.com',
    telefono: '+1234567893',
    rol: 'mecanico',
    activo: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

const rolConfig = {
  administrador: { icon: Shield, color: 'text-danger-600', bg: 'bg-danger-100', label: 'Administrador' },
  recepcionista: { icon: UserCheck, color: 'text-primary-600', bg: 'bg-primary-100', label: 'Recepcionista' },
  mecanico: { icon: UserCheck, color: 'text-secondary-600', bg: 'bg-secondary-100', label: 'Mecánico' },
};

export function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<User | null>(null);
  const [filterRol, setFilterRol] = useState<UserRole | ''>('');
  const [filterEstado, setFilterEstado] = useState('');

  const filteredUsuarios = mockUsuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.telefono.includes(searchTerm);
    
    const matchesRol = filterRol === '' || usuario.rol === filterRol;
    const matchesEstado = filterEstado === '' || 
                         (filterEstado === 'activo' && usuario.activo) ||
                         (filterEstado === 'inactivo' && !usuario.activo);
    
    return matchesSearch && matchesRol && matchesEstado;
  });

  const handleEdit = (usuario: User) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setShowModal(true);
  };

  const handleToggleEstado = (usuario: User) => {
    // Lógica para activar/desactivar usuario
    console.log('Toggling estado for user:', usuario.id);
  };

  const getUsuariosStats = () => {
    const totalUsuarios = mockUsuarios.length;
    const usuariosActivos = mockUsuarios.filter(u => u.activo).length;
    const administradores = mockUsuarios.filter(u => u.rol === 'administrador').length;
    const mecanicos = mockUsuarios.filter(u => u.rol === 'mecanico').length;
    
    return { totalUsuarios, usuariosActivos, administradores, mecanicos };
  };

  const stats = getUsuariosStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Gestión de Usuarios
          </h1>
          <p className="text-neutral-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={handleCreate} className="shadow-medium">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalUsuarios}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-medium">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Activos</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.usuariosActivos}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-success-500 to-success-600 shadow-medium">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Administradores</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.administradores}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-danger-500 to-danger-600 shadow-medium">
                <Shield className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Mecánicos</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.mecanicos}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-medium">
                <UserCheck className="h-7 w-7 text-white" />
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
              Lista de Usuarios
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterRol} onChange={(e) => setFilterRol(e.target.value as UserRole | '')}>
                <option value="">Todos los roles</option>
                <option value="administrador">Administrador</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="mecanico">Mecánico</option>
              </Select>
              <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </Select>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar usuarios..."
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
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsuarios.map((usuario) => {
                  const RolIcon = rolConfig[usuario.rol].icon;
                  return (
                    <tr key={usuario.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                            <span className="text-sm font-bold text-white">
                              {usuario.nombre.split(' ').map(n => n.charAt(0)).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-neutral-900">{usuario.nombre}</div>
                            <div className="text-sm text-neutral-500">ID: {usuario.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-neutral-900">{usuario.email}</div>
                        <div className="text-sm text-neutral-500">{usuario.telefono}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${rolConfig[usuario.rol].bg} ${rolConfig[usuario.rol].color}`}>
                          <RolIcon className="h-3 w-3 mr-1" />
                          {rolConfig[usuario.rol].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                          usuario.activo 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {usuario.activo ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Inactivo
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date(usuario.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(usuario)} className="hover:bg-primary-50 hover:text-primary-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleEstado(usuario)}
                            className={usuario.activo ? "hover:bg-warning-50 hover:text-warning-600" : "hover:bg-success-50 hover:text-success-600"}
                          >
                            {usuario.activo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600">
                            <Trash2 className="h-4 w-4" />
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
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-strong border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre Completo" defaultValue={selectedUsuario?.nombre} />
              <Input label="Email" type="email" defaultValue={selectedUsuario?.email} />
              <Input label="Teléfono" defaultValue={selectedUsuario?.telefono} />
              <Select label="Rol" defaultValue={selectedUsuario?.rol}>
                <option value="">Seleccionar rol</option>
                <option value="administrador">Administrador</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="mecanico">Mecánico</option>
              </Select>
              {!selectedUsuario && (
                <>
                  <Input label="Contraseña" type="password" />
                  <Input label="Confirmar Contraseña" type="password" />
                </>
              )}
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedUsuario?.activo ?? true}
                    className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm font-semibold text-neutral-700">Usuario activo</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowModal(false)}>
                {selectedUsuario ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}