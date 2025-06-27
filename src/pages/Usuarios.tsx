import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX, Shield } from 'lucide-react';
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
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6B7280',
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Lista de Usuarios
            </CardTitle>
            <div className="flex space-x-4">
              <Select value={filterRol} onChange={(e) => setFilterRol(e.target.value)}>
                <option value="">Todos los roles</option>
                {roles.map(rol => (
                  <option key={rol.id} value={String(rol.id)}>{rol.description}</option>
                ))}
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
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsuarios.map((usuario) => {
                  return (
                    <tr key={usuario.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                            <span className="text-sm font-bold text-white">
                              {usuario.name.split(' ').map(n => n.charAt(0)).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-neutral-900">{usuario.name} {usuario.lastName}</div>
                            <div className="text-sm text-neutral-500">ID: {usuario.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-neutral-900">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {usuario.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {getUserRoles(usuario, roles)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="hover:bg-accent-50 hover:text-accent-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(usuario)} className="hover:bg-primary-50 hover:text-primary-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-danger-50 hover:text-danger-600" onClick={() => handleDelete(usuario.id)}>
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
              <Input label="Nombre" name="name" value={formValues.name || ''} onChange={handleInputChange} />
              <Input label="Apellido" name="lastName" value={formValues.lastName || ''} onChange={handleInputChange} />
              <Input label="Email" name="email" value={formValues.email || ''} onChange={handleInputChange} />
              <Input label="Username" name="userName" value={formValues.userName || ''} onChange={handleInputChange} />
              <Input label="Contraseña" name="password" value={formValues.password || ''} onChange={handleInputChange} />
              <Select
                multiple
                label="Roles"
                name="roles"
                value={formValues.roles || []}
                onChange={handleRolesChange}
              >
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>{rol.description}</option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {selectedUsuario ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}