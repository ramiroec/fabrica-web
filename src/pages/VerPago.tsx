import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pago } from "./interfaces/pagos";

function VerPago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pago, setPago] = useState<Pago | null>(null);
  const [montoPagado, setMontoPagado] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const url = `/pago_empleado/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setPago(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos del pago:", error);
        toast.error("Error al obtener datos del pago");
      });
  }, [id]);

  const handleMontoPagadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "");
    setMontoPagado(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pago) return;

    const nuevoMontoPagado = parseFloat(montoPagado.replace(/\./g, ""));
    const nuevoSaldo = parseFloat(pago.saldo_periodo.toString()) - nuevoMontoPagado;
    const payload = {
      ...pago,
      monto_pagado: (parseFloat(pago.monto_pagado?.toString() || '0') + nuevoMontoPagado),
      saldo_periodo: nuevoSaldo
    };

    authenticatedApi()
      .put(`/pago_empleado/${id}`, payload)
      .then((res) => {
        toast.success("Pago actualizado con éxito!");
        navigate(`/ListarPago`);
      })
      .catch((err) => {
        toast.error("Error al actualizar el pago");
        console.error("Error al actualizar el pago:", err);
      });
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "0";
    return new Intl.NumberFormat('de-DE').format(value);
  };

  return (
    <div>
      <ContentHeader title="Detalles del Pago" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <h3 className="card-title">Detalles del Pago</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando datos...</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>Empleado</label>
                      <p>{pago?.nombre_completo}</p>
                    </div>
                    <div className="form-group col-md-6">
                      <label>Periodo</label>
                      <p>{pago?.periodo_pago}</p>
                    </div>
                    <div className="form-group col-md-6">
                      <label>Monto Total</label>
                      <p>{formatCurrency(pago?.monto_total)}</p>
                    </div>
                    <div className="form-group col-md-6">
                      <label>Monto Pagado</label>
                      <p>{formatCurrency(pago?.monto_pagado)}</p>
                    </div>
                    <div className="form-group col-md-6">
                      <label>Saldo del Periodo</label>
                      <p>{formatCurrency(pago?.saldo_periodo)}</p>
                    </div>
                    <div className="form-group col-md-6">
                      <label>Nuevo Pago</label>
                      <input
                        type="text"
                        className="form-control"
                        value={montoPagado}
                        onChange={handleMontoPagadoChange}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-info">
                    Actualizar Pago
                  </button>
                </form>
              )}
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary" onClick={() => navigate("/ListarPago")}>
                Volver a la Lista
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerPago;
