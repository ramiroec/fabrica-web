import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Agenda } from "./interfaces/agenda";
import moment from 'moment';

const ListarAgendaPaciente = ({ isClearfix = false }: { isClearfix?: boolean }) => {
  const { id } = useParams();
  const [agendas, setData] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true); // Variable de estado para indicar si los datos se están cargando
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const url = `/agenda/paciente/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    // Solo inicializar la tabla si no hay una instancia previa y si los datos no se están cargando
    if (tableRef.current && !dataTableRef.current && !loading) {
      // Guardar la instancia de DataTables en el ref
      dataTableRef.current = initializeDataTable(tableRef.current);
    }
  }, [agendas, loading]);

  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">
                    Listado de Agendamientos
                  </h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? ( // Mostrar un mensaje si los datos se están cargando
                <p>Cargando datos...</p>
              ) : (
                <>
                  <div className="d-none d-lg-block">
                    <div className="table-responsive">
                      <table
                        ref={tableRef}
                        className="table table-bordered table-hover datatable"
                      >
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                            <th>Terapeuta</th>
                            <th>Estado</th>
                            <th>Ver Más</th>
                            <th>Ver OS</th> {/* Nueva columna para Ver OS */}

                          </tr>
                        </thead>
                        <tbody>
                          {agendas.map((agenda, index) => (
                            <tr key={agenda.id}>
                              <td>{index + 1}</td>
                              <td>{moment(agenda.fecha).format('DD/MM/YYYY')}</td>
                              <td>{agenda.desde}</td>
                              <td>{agenda.hasta}</td>
                              <td>{agenda.terapeuta_nombre_completo}</td>
                              <td className={`estado-${agenda.estado.toLowerCase().split(' ').join('-')}`}>
                                {agenda.estado || "N/A"}
                              </td>
                              <td>
                                <Link
                                  className="icon-block"
                                  to={`/agenda/${agenda.id}`}
                                >
                                  <i className="fa fa-fw fa-plus"></i>Ver más
                                </Link>
                              </td>

                              <td>
                                <Link className="icon-block" to={`/orden_de_servicio/${agenda.orden_de_servicio}`}>
                                  <i className="fa fa-fw fa-file"></i>Ver OS
                                </Link>
                              </td>


                            </tr>


                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-lg-none">
                    {agendas.map((agenda, index) => (
                      <div key={agenda.id} className="card mb-2">
                        <div className="card-body">
                          <p><strong>ID:</strong> {index + 1}</p>
                          <p><strong>Fecha:</strong> {moment(agenda.fecha).format('DD/MM/YYYY')}</p>
                          <p><strong>Desde:</strong> {agenda.desde}</p>
                          <p><strong>Hasta:</strong> {agenda.hasta}</p>
                          <p><strong>Terapeuta:</strong> {agenda.terapeuta_nombre_completo}</p>
                          <p className={`estado-${agenda.estado.toLowerCase().split(' ').join('-')}`}><strong>Estado:</strong> {agenda.estado || "N/A"}</p>
                          <Link
                            className="icon-block"
                            to={`/agenda/${agenda.id}`}
                          >
                            <i className="fa fa-fw fa-plus"></i>Ver más
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="card-footer"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ListarAgendaPaciente;

// Agrega el siguiente bloque de CSS al final de tu archivo JavaScript (React)
const styles = `
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table thead th {
  white-space: nowrap;
}

.table tbody td {
  white-space: nowrap;
}

.estado-reservado {
  background-color: #cfeff9; /* Azul claro para estado En Curso */
}

.estado-pendiente {
  background-color: #ffeeba; /* Amarillo claro para estado Pendiente */
}

.estado-cancelado {
  background-color: #d3d3d3; /* Gris claro para estado Cancelado */
}

.estado-confirmado {
  background-color: #c1e7c3; /* Verde claro para estado Confirmado */
}

.estado-disponible {
  background-color: #c1e7c3; /* Verde claro para estado Confirmado */
}

.estado-en-curso {
  background-color: #cfeff9; /* Azul claro para estado En Curso */
}

.estado-concluido {
  background-color: #d6e2d5; /* Gris verdoso para estado Concluido */
}

.estado-cancelado-paciente {
  background-color: #ffcccb; /* Rojo claro para estado Cancelado Paciente */
}
.estado-cancelado-terapeuta {
  background-color: #ffcccb; /* Rojo claro*/
}

`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
