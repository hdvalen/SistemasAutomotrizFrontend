import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Search} from 'lucide-react';
import { getAuditory } from '../Apis/AuditoryApis';
import type { Auditory } from '../types';

export function Configuracion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAuditory, setSelectedAuditory] = useState<Auditory | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [auditoria, setAuditory] = useState<Auditory[]>([]);
  
  useEffect(() => {
      getAuditory().then((data) => {
        if (data) {
          setAuditory(data);
        }
      });
    }, []);

  const filteredAuditories = auditoria.filter(audit => 
    audit.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.changeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
            Historial Sistema Automotriz
          </h1>
          <p className="text-neutral-600 mt-1">Encuentra los cambios que se han realizado</p>
        </div>
      </div>

        {/* Contenido principal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Lista de Cambios
            </CardTitle>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Buscar cambios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Entidad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Tipo de Cambio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Cambiado por
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                {filteredAuditories.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                          <span className="text-sm font-bold text-white">
                            {audit.entityName.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{audit.entityName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{audit.changeType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{audit.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {audit.date 
                      ? new Date(audit.date).toLocaleString('es-CO', { timeZone: 'America/Bogota' })
                      : 'Sin hora'}
                  </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}