import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Responsable } from "./interfaces/responsable";

function ListarResposable() {
  const [responsables, setData] = useState<Responsable[]>([]);
  const [loading, setLoading] = useState(true); 
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const url = `/responsable`;
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
  }, [responsables, loading]);

  return (
    <div>
      <ContentHeader title="Responsables" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">
                    Listado con Información de los Responsables
                  </h3>
                </div>
                <div className="col-lg-3 text-right">
                  <Link className="btn btn-info" to="/responsable/crear">
                    Crear Responsable
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
                      <th>Numero documento</th>
                      <th>Celular</th>
                      <th>email</th> 
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responsables.map((responsable, index) => (
                      <tr key={responsable.id}>
                        <td>{responsable.nombre} {responsable.apellido}</td>
                        <td>{responsable.numero_documento}</td>
                        <td>{responsable.celular}</td>
                        <td>{responsable.email}</td>
                        <td>
                          <Link
                            className="icon-block"
                            to={`/responsable/${responsable.id}`}
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
export default ListarResposable;
