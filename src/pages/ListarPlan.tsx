import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Plan } from "./interfaces/plan";

function ListarPlan() {
  const [planes, setData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true); // Variable de estado para indicar si los datos se están cargando
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const url = `/plan`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false); // Cambiar el estado de loading a false cuando se reciban los datos
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
  }, [planes, loading]);

  return (
    <div>
      <ContentHeader title="Planes" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">
                    Listado con Información de los Planes
                  </h3>
                </div>
                <div className="col-lg-3 text-right">
                  <Link className="btn btn-info" to="/plan/crear">
                    Crear Plan
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
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Observación</th>
                      <th>Estado</th>
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planes.map((plan, index) => (
                      <tr key={plan.id}>
                       <td>{index + 1}</td>
                        <td>{plan.descripcion}</td>
                        <td>{plan.observacion}</td>
                        <td>{plan.estado}</td>
                        <td>
                          <Link
                            className="icon-block"
                            to={`/plan/${plan.id}`}
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
export default ListarPlan;
