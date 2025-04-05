import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Paciente } from "./interfaces/paciente";

function BuscarPaciente() {
  const { buscar } = useParams();
  const [perfiles, setData] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true); 
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const url = `/paciente/buscar/${buscar}`;
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
  }, [perfiles, loading]);

  return (
    <div>
      <ContentHeader title="Paciente" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">
                    Listado con Información de los Pacientes
                  </h3>
                </div>
                <div className="col-lg-3 text-right">
                  <Link className="btn btn-info" to="/paciente/crear">
                    Crear Paciente
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? ( // Mostrar un mensaje si los datos se están cargando
                <p>Cargando datos...</p>
              ) : ( // Mostrar la tabla si los datos no se están cargando
                <table
                  ref={tableRef}
                  className="table table-bordered table-hover datatable full-width nowrap"
                >
                  <thead>
                    <tr>
                      <th>Nombre y Apellido</th>
                      <th>Tipo de Documento</th>
                      <th>Número de Documento</th>
                      <th>Edad</th>
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfiles.map((paciente, index) => (
                      <tr key={paciente.id}>
                        <td>{paciente.nombre} {paciente.apellido}</td>
                        <td>{paciente.tipo_documento}</td>
                        <td>{paciente.numero_documento}</td>
                        <td>{paciente.edad}</td>
                        <td>
                          <Link
                            className="icon-block"
                            to={`/paciente/${paciente.id}`}
                          >
                            <i className="fa fa-fw fa-plus"></i>Ver más
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="card-footer"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default BuscarPaciente;
