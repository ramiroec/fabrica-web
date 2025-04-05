import React, { useState, useEffect } from 'react';
import { ContentHeader } from '@components';
import { authenticatedApi } from './interfaces/api';

const AuditoriaPaciente = () => {
  const [auditoria, setAuditoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const response = await authenticatedApi().get('/paciente/auditoria');        
        setAuditoria(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, []);

  return (
    <div>
      <ContentHeader title="Auditoría de Pacientes" />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Historial de Auditoría</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table responsive-table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Detalles</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditoria.map((registro) => (
                        <tr key={registro.id}>
                          <td>{registro.nombre_completo_usuario}</td>
                          <td>{registro.accion}</td>
                          <td>
                            {registro.accion === 'Actualizar' ? (
                              <>
                                <p><strong>Cambios:</strong> {mostrarCambios(registro.datos_anteriores, registro.datos_nuevos)}</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Antes:</strong> {simplificarDatos(registro.datos_anteriores)}</p>
                                <p><strong>Ahora:</strong> {simplificarDatos(registro.datos_nuevos)}</p>
                              </>
                            )}
                          </td>
                          <td>{new Date(registro.fecha).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Función para mostrar solo las diferencias entre los datos anteriores y los nuevos
const mostrarCambios = (datosAnteriores: any, datosNuevos: any) => {
  if (!datosAnteriores || !datosNuevos) return 'Sin datos';
  
  const cambios = Object.keys(datosNuevos).filter(key => datosAnteriores[key] !== datosNuevos[key]);
  
  if (cambios.length === 0) return 'Sin cambios';
  
  return cambios.map(clave => `${clave}: ${datosAnteriores[clave]} → ${datosNuevos[clave]}`).join(', ');
};

// Función para simplificar la representación de los datos (si no hay cambios)
const simplificarDatos = (datos: any) => {
  if (!datos) return 'Sin datos';
  // Índices específicos que queremos mostrar
  const indicesEspecificos = [0, 7, 9];
  // Filtramos las claves de acuerdo a los índices específicos
  const clavesImportantes = Object.keys(datos).filter((_, index) => indicesEspecificos.includes(index));
  return clavesImportantes.length > 0 
    ? clavesImportantes.map(clave => `${clave}: ${datos[clave]}`).join(', ') 
    : 'Sin datos';};

export default AuditoriaPaciente;

const styles = `
.table-responsive {
  overflow-x: auto;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
}

.responsive-table th,
.responsive-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.responsive-table td p {
  margin: 0;
}

@media (max-width: 768px) {
  .responsive-table thead {
    display: none;
  }

  .responsive-table tr {
    display: block;
    margin-bottom: 0.625em;
  }

  .responsive-table td {
    display: block;
    text-align: right;
    font-size: 0.8em;
    padding-left: 50%;
    position: relative;
  }

  .responsive-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 0.5em;
    white-space: nowrap;
    font-weight: bold;
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
