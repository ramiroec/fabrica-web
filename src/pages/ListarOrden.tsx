import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Orden_de_Servicio } from "./interfaces/orden_de_servicio";
import moment from 'moment';

function ListarOrden({ isClearfix = false }: { isClearfix?: boolean }) {
  const { id } = useParams();
  const [ordenes, setData] = useState<Orden_de_Servicio[]>([]);
  const [loading, setLoading] = useState(true); // Variable de estado para indicar si los datos se están cargando
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    const url = `/orden_de_servicio/paciente/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false); // Cambiar el estado de loading a false cuando se reciban los datos
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, [id]);

  useEffect(() => {
    // Solo inicializar la tabla si no hay una instancia previa y si los datos no se están cargando
    if (tableRef.current && !dataTableRef.current && !loading) {
      // Guardar la instancia de DataTables en el ref
      dataTableRef.current = initializeDataTable(tableRef.current);
    }
  }, [ordenes, loading]);

  const calcularEstadoOS = (estado: string, saldo: number) => {
    return saldo === 0 ? 'total' : estado;
  };

  const calculateEstadoFacturacion = (saldo: number) => {
    if (saldo <= 0) {
      return "Total";
    } else {
      return "Parcial";
    }
  };

  const obtenerClaseEstado = (estado: string) => {
    // Ensure estado is a string
    const normalizedEstado = (estado || "").toLowerCase();
    switch (normalizedEstado) {
      case 'pre-cargado':
        return 'bg-secondary text-white'; // Gris
      case 'en curso':
        return 'bg-primary text-white'; // Azul
      case 'concluido':
        return 'bg-success text-white'; // Verde
      case 'cancelado':
        return 'bg-danger text-white'; // Rojo
      case 'total':
        return 'bg-success text-white'; // Verde (para 'Total')
      default:
        return '';
    }
  };





  const obtenerClaseEstadoOrden = (estado: string) => {
    // Ensure estado is a string
    const normalizedEstado = (estado || "").toLowerCase();
    switch (normalizedEstado) {
      

      case 'activo':
      case 'activa':
        return 'text-verdeorden font-bold'; // verde y negrita

      case 'cancelado':
      case 'cancelada':
        return 'text-rojoorden font-bold'; // rojo y negrita

     
    }
  };






  return (
    <div>
      <div className="container-fluid">
        <div className="card card-info card-outline">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-9">
                <h3 className="card-title">
                  Listado con Información de las Órdenes de Servicio
                </h3>
              </div>
              <div className="col-lg-3 text-right">
                <Link className="btn btn-info" to={`/orden_de_servicio/crear/${id}`}>
                  Crear Orden de Servicio
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body">
            {loading ? ( // Mostrar un mensaje si los datos se están cargando
              <p>Cargando datos...</p>
            ) : ( // Mostrar la tabla si los datos no se están cargando
              <div className="table-responsive">
                <table className="table table-bordered table-hover datatable" ref={tableRef}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Servicio</th>
                      <th>Fecha</th>
                      <th>Plan</th>
                      <th>Estado de Factura</th>
                      <th>Estado de Fechas</th>
                      <th>Estado de la orden</th>
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map((orden, index) => (
                      <tr key={orden.id}>
                        <td>{orden.id}</td>
                        <td>{orden.servicio_descripcion}</td>
                        <td>{moment(orden.fecha).format('DD/MM/YYYY')}</td>
                        <td>{orden.plan_descripcion}</td>
                        <td>{calculateEstadoFacturacion(orden.saldo)}</td>
                        <td className={obtenerClaseEstado(calcularEstadoOS(orden.estado_os, orden.saldo))}>
                          {calcularEstadoOS(orden.estado_os, orden.saldo)}
                        </td>
                        <td className={obtenerClaseEstadoOrden(orden.estado)}>
                          {orden.estado}
                        </td>
                        <td>
                          <Link className="icon-block" to={`/orden_de_servicio/${orden.id}`}>
                            <i className="fa fa-fw fa-plus"></i>Ver más
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="card-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default ListarOrden;

// CSS para los colores de fondo de los estados de OS
const styles = `
.bg-secondary {
  background-color: #6C757D !important;
}

.bg-primary {
  background-color: #007BFF !important;
}

.bg-success {
  background-color: #28A745 !important;
}

.bg-danger {
  background-color: #DC3545 !important;
}

.text-white {
  color: #ffffff !important;
}

.text-verdeorden {
  color: #28A745 !important; /* Verde */
}

.font-bold {
  font-weight: bold !important; /* Negrita */
}

.text-rojoorden {
  color: #DC3545 !important; /* Rojo */
}


`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
