import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Usuario } from "./interfaces/usuario";

function ListarUsuario() {
  const [usuariosActivos, setUsuariosActivos] = useState<Usuario[]>([]);
  const [usuariosInactivos, setUsuariosInactivos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true); // Variable de estado para indicar si los datos se están cargando
  const tableActivosRef = useRef(null);
  const tableInactivosRef = useRef(null);
  const dataTableActivosRef = useRef(null);
  const dataTableInactivosRef = useRef(null);

  useEffect(() => {
    const url = `/usuario`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        // Separar usuarios activos e inactivos
        const activos = response.data.filter((usuario: Usuario) => usuario.estado === 'Activo');
        const inactivos = response.data.filter((usuario: Usuario) => usuario.estado !== 'Activo');
        
        setUsuariosActivos(activos);
        setUsuariosInactivos(inactivos);
        setLoading(false); // Cambiar el estado de loading a false cuando se reciban los datos
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    // Inicializar DataTable para activos
    if (tableActivosRef.current && !dataTableActivosRef.current && !loading) {
      dataTableActivosRef.current = initializeDataTable(tableActivosRef.current);
    }
    // Inicializar DataTable para inactivos
    if (tableInactivosRef.current && !dataTableInactivosRef.current && !loading) {
      dataTableInactivosRef.current = initializeDataTable(tableInactivosRef.current);
    }
  }, [usuariosActivos, usuariosInactivos, loading]);

  return (
    <div>
      <ContentHeader title="Empleados" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">Listado con Información de los Empleados</h3>
                </div>
                <div className="col-lg-3 text-right">
                  <Link className="btn btn-info" to="/configuracion/usuario/crear">Crear Empleado</Link>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? ( // Mostrar un mensaje si los datos se están cargando
                <p>Cargando datos...</p>
              ) : (
                <>
                  {/* Listado de Empleados Activos */}
                  <h4>Empleados Activos</h4>
                  <table
                    ref={tableActivosRef}
                    className="table table-bordered table-hover datatable full-width nowrap"
                  >
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Tipo</th>
                        <th>Documento</th>
                        <th>Usuario</th>
                        <th>Teléfono</th>
                        <th>Ver más</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosActivos.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.apellido}</td>
                          <td>{usuario.tipo_documento}</td>
                          <td>{usuario.numero_documento}</td>
                          <td>{usuario.usuario}</td>
                          <td>{usuario.telefono}</td>
                          <td>
                            <Link className="icon-block" to={`/configuracion/usuario/${usuario.id}`}>
                              <i className="fa fa-fw fa-plus"></i>Ver más
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Listado de Empleados Inactivos */}
                  <h4>Empleados Inactivos</h4>
                  <table
                    ref={tableInactivosRef}
                    className="table table-bordered table-hover datatable full-width nowrap"
                  >
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Tipo</th>
                        <th>Documento</th>
                        <th>Usuario</th>
                        <th>Teléfono</th>
                        <th>Ver más</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosInactivos.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.apellido}</td>
                          <td>{usuario.tipo_documento}</td>
                          <td>{usuario.numero_documento}</td>
                          <td>{usuario.usuario}</td>
                          <td>{usuario.telefono}</td>
                          <td>
                            <Link className="icon-block" to={`/usuario/${usuario.id}`}>
                              <i className="fa fa-fw fa-plus"></i>Ver más
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default ListarUsuario;
