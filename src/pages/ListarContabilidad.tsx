import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { Contabilidad } from "./interfaces/contabilidad";
import ModalDetalles from "./ModalDetalles";

function ListarContabilidad() {
  const [contabilidadbasi, setData] = useState<Contabilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState<Contabilidad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresoResponse, egresoResponse] = await Promise.all([
          authenticatedApi().get('/ingreso'),
          authenticatedApi().get('/egreso')
        ]);

        const ingresos = ingresoResponse.data.map((item: Contabilidad) => ({ ...item, tipo_movimiento: 'Ingreso' }));
        const egresos = egresoResponse.data.map((item: Contabilidad) => ({ ...item, tipo_movimiento: 'Egreso' }));

        const combinedData = [...ingresos, ...egresos];
        setData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tableRef.current && !dataTableRef.current && !loading) {
      dataTableRef.current = initializeDataTable(tableRef.current);
    }
  }, [contabilidadbasi, loading]);

  const formatMonto = (monto: number) => {
    if (monto !== undefined && monto !== null) {
      return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(monto);
    }
    return 'N/A';
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Fecha inválida';  // O cualquier mensaje que prefieras
    }
    return parsedDate.toLocaleDateString('es-PY');
  };

  const handleOpenModal = (data: Contabilidad) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedData(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ContentHeader title="Contabilidad" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">Listado con la información de la Contabilidad Básica</h3>
                </div>
                <div className="col-lg-3 text-right">
                  <Link className="btn btn-info" to="/CrearContabilidad">
                    Crear Nuevo
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando datos...</p>
              ) : (
                <table
                  ref={tableRef}
                  className="table table-bordered table-hover datatable full-width nowrap"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Tipo de Movimiento</th>
                      <th>Descripción</th>
                      <th>Monto (Gs)</th>
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contabilidadbasi.map((conta, index) => (
                      <tr key={conta.id}>
                        <td>{index + 1}</td>
                        <td>{formatDate(conta.fecha)}</td>
                        <td>{conta.tipo_movimiento}</td>
                        <td>{conta.descripcion}</td>
                        <td>{formatMonto(conta.monto)}</td>
                        <td>
                          <Link
                            className="icon-block"
                            to="#"
                            onClick={() => handleOpenModal(conta)}
                          >
                            <i className="fa fa-fw fa-plus"></i> Ver más
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
      <ModalDetalles
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        data={selectedData}
      />
    </div>
  );
}

export default ListarContabilidad;
