import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Search} from 'lucide-react';
import { getAuditory } from '../Apis/AuditoryApis';
import type { Auditory } from '../types';

export function Historial() {
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            Historial Sistema Automotriz
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">Encuentra los cambios que se han realizado</p>
        </div>
      </div>

        {/* Contenido principal */}
        <Card className='bg-zinc-800 border border-zinc-700 shadow-xl  '>
          <CardHeader className="bg-gradient-to-r  to-indigo-900 border-b border-zinc-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center text-xl font-bold text-white">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              Lista de Cambios
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Buscar cambios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-800 text-white border-zinc-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full sm:w-64"
              />
            </div>
          </div>
          </CardHeader>
          <CardContent className="p-0">
            <div >
              <table className="min-w-full divide-y divide-zinc-500">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Entidad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Tipo de Cambio
                    </th>
                  </tr>
                </thead>
               <tbody className="bg-zinc-900 divide-y divide-zinc-800">
  {filteredAuditories.map((audit) => (
    <tr
      key={audit.id}
      className="hover:bg-zinc-800 transition-all duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">
              {audit.entityName.charAt(0)}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-zinc-100">{audit.entityName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-zinc-100">{audit.changeType}</div>
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