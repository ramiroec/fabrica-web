import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import initializeDataTable from "./interfaces/DataTableConfig";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pago } from "./interfaces/pagos";

function ListarPago() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/pago_empleado`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setPagos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        toast.error("Error al obtener datos");
      });
  }, []);

  useEffect(() => {
    if (tableRef.current && !dataTableRef.current && !loading) {
      dataTableRef.current = initializeDataTable(tableRef.current);
    }
  }, [pagos, loading]);

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  return (
    <div>
      <ContentHeader title="Pagos" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <h3 className="card-title">
                    Listado con Información de los Pagos
                  </h3>
                </div>
                <div className="col-lg-3 text-right">
                  <Link className="btn btn-info" to="/CrearPago">
                    Crear Pago
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
                      <th>Empleado</th>
                      <th>Periodo</th>
                      <th>Monto Total</th>
                      <th>Monto Pagado</th>
                      <th>Saldo del Periodo</th>
                      <th>Ver más</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id}>
                        <td>{pago.id}</td>
                        <td>{pago.nombre_completo}</td>
                        <td>{pago.periodo_pago}</td>
                        <td>{formatCurrency(pago.monto_total)}</td>
                        <td>{formatCurrency(pago.monto_pagado)}</td>
                        <td
                          style={{
                            backgroundColor:
                              pago.saldo_periodo > 0 ? "orange" : "green",
                            color: "white",
                          }}
                        >
                          {formatCurrency(pago.saldo_periodo)}
                        </td>
                        <td>
                          <Link 
                           className="icon-block"
                            to={`/VerPago/${pago.id}`}
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

export default ListarPago;
