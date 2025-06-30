import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX, Shield, Users, Mail, Crown } from 'lucide-react';
import type { User, Rol } from '../types';
import { getUser, postUser, deleteUser, putUser } from '../Apis/UserApis';
import { getUserRol } from '../Apis/UserRolApis';
import { getRol } from '../Apis/RolApis';

type UserWithRoles = User & { roles?: string[] };

const getUserRoles = (usuario: UserWithRoles, roles: Rol[]): string => {
  if (!usuario.roles || usuario.roles.length === 0) return 'Sin rol';
  return usuario.roles
    .map(roleId => roles.find(r => String(r.id) === String(roleId))?.description)
    .filter(Boolean)
    .join(', ');
};

export function Usuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<User | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [formValues, setFormValues] = useState<Partial<User> & { roles?: string[] }>({});
  const [filterRol, setFilterRol] = useState<string>('');
  const [userRoles, setUserRoles] = useState<{ userId: number; rolId: number }[]>([]);

  useEffect(() => {
    getUser().then((data) => {
      if (data) setUsuarios(data);
    });
    getRol().then((data) => {
      if (data) setRoles(data);
    });
    getUserRol().then((data) => {
      if (data) setUserRoles(data);
    });
  }, []);

  // Map roles to each user (assuming backend returns user.roles as array of role IDs)
  const usuariosWithRoles: UserWithRoles[] = usuarios.map(user => ({
    ...user,
    roles: userRoles
      .filter(ur => ur.userId === user.id)
      .map(ur => String(ur.rolId))
  }));

  const filteredUsuarios = usuariosWithRoles.filter(usuario => {
    const matchesSearch = usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === '' || (usuario.roles && usuario.roles.includes(filterRol));
    return matchesSearch && matchesRol;
  });

  const handleEdit = (usuario: User & { roles?: string[] }) => {
    setSelectedUsuario(usuario);
    setFormValues({ ...usuario, roles: usuario.roles ? usuario.roles.map(String) : [] });
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setFormValues({});
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormValues(prev => ({ ...prev, roles: selectedIds }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formValues,
      roles: formValues.roles || []
    };
    if (selectedUsuario) {
      await putUser(payload as User, selectedUsuario.id);
    } else {
      await postUser(payload as User);
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'El usuario ha sido creado exitosamente',
        showConfirmButton: false,
        timer: 1500
      });
    }
    setShowModal(false);
    const users = await getUser();
    if (users) setUsuarios(users);
  };

  const handleDelete = async (id: number | string) => {
    const result = await Swal.fire({
      title: '¿Esta seguro de eliminar el usuario?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        const users = await getUser();
        if (users) setUsuarios(users);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el usuario',
        });
      }
    }
  };

  const activeUsers = usuarios.filter(u => u.isActive).length;
  const inactiveUsers = usuarios.length - activeUsers;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-400 mt-1">Administra los usuarios del sistema</p>
          </div>
          <Button 
            onClick={handleCreate} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Total Usuarios</p>
                  <p className="text-3xl font-bold text-white mt-1">{usuarios.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Usuarios Activos</p>
                  <p className="text-3xl font-bold text-white mt-1">{activeUsers}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Usuarios Inactivos</p>
                  <p className="text-3xl font-bold text-white mt-1">{inactiveUsers}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <UserX className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800 border border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Roles</p>
                  <p className="text-3xl font-bold text-white mt-1">{roles.length}</p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-zinc-900 border border-zinc-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center text-white">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                Lista de Usuarios
              </CardTitle>
              <div className="flex space-x-4">
                <Select 
                  value={filterRol} 
                  onChange={(e) => setFilterRol(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <option value="">Todos los roles</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={String(rol.id)}>{rol.description}</option>
                  ))}
                </Select>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div >
              <table className="min-w-full divide-y divide-zinc-700">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-zinc-900 divide-y divide-zinc-700">
  {filteredUsuarios.map((usuario) => {
    const userRoleNames = getUserRoles(usuario, roles);
    return (
      <tr key={usuario.id} className="hover:bg-zinc-800 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {usuario.name.split(' ').map(n => n.charAt(0)).join('')}
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-bold text-neutral-100">
                {usuario.name} {usuario.lastName}
              </div>
              <div className="text-sm text-neutral-400">
                <span className="font-medium">ID:</span> {usuario.id}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-neutral-400 mr-2" />
            <div className="text-sm font-semibold text-neutral-100">{usuario.email}</div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-neutral-100 font-medium">
            @{usuario.userName}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="inline-flex items-center">
            <Crown className="h-4 w-4 text-purple-400 mr-2" />
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              userRoleNames === 'Sin rol' 
                ? 'bg-zinc-700 text-zinc-300' 
                : 'bg-purple-800 text-purple-200'
            }`}>
              {userRoleNames}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleEdit(usuario)} 
              className="hover:bg-blue-900 hover:text-blue-300 text-zinc-400"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-red-900 hover:text-red-300 text-red-400" 
              onClick={() => handleDelete(usuario.id)}
            >
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
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-xl border border-gray-300 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center shadow-md">
          <Users className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Nombre</label>
          <Input 
            name="name" 
            value={formValues.name || ''} 
            onChange={handleInputChange}
            className="w-full bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Apellido</label>
          <Input 
            name="lastName" 
            value={formValues.lastName || ''} 
            onChange={handleInputChange}
            className="w-full bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
          <Input 
            name="email" 
            type="email"
            value={formValues.email || ''} 
            onChange={handleInputChange}
            className="w-full bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Username</label>
          <Input 
            name="userName" 
            value={formValues.userName || ''} 
            onChange={handleInputChange}
            className="w-full bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Contraseña</label>
          <Input 
            name="password" 
            type="password"
            value={formValues.password || ''} 
            onChange={handleInputChange}
            className="w-full bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Roles</label>
          <Select
            multiple
            name="roles"
            value={formValues.roles || []}
            onChange={handleRolesChange}
            className="w-full bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-lg min-h-[120px]"
          >
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.description}</option>
            ))}
          </Select>
          <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples roles</p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={() => setShowModal(false)}
          className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
        >
          {selectedUsuario ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}