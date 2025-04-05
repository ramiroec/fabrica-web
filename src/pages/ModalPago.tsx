import React, { useState } from 'react';
import Modal from 'react-modal';
import { useParams } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bottom: 'auto',
    height: 'auto', // Altura automática
    maxHeight: '90vh', // Máxima altura del modal
    overflow: 'auto', // Habilita el desplazamiento si el contenido es demasiado largo
    paddingBottom: '20px', // Espacio en blanco mínimo al final
  },
};

const responsiveStyles = `
  @media (max-width: 600px) {
    .ReactModal__Content {
      width: 100% !important;
      height: 90% !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }

    .form-group {
      width: 100% !important;
    }

    .d-flex {
      flex-direction: column;
      align-items: stretch;
    }

    .btn {
      width: 100%;
      margin-bottom: 10px;
    }

    .btn-danger {
      margin-top: 0;
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  servicio: string;
  saldo: number;
  
  onRequestClose: () => void;
}

const MyModal: React.FC<ModalProps> = ({ isOpen, onRequestClose, servicio, saldo }) => {
  const today = new Date().toISOString().split('T')[0];

  const { id } = useParams();
  const [data, setData] = useState({
    orden_de_servicio: "",
    fecha_de_pago: today,
    monto_pagado: "",
    forma_de_pago: "",
    numero_de_factura: "",
    comprobante: "",
  });

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '') // Eliminar caracteres no numéricos
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Añadir separadores de miles
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const montoPagado = parseFloat(data.monto_pagado.replace(/\./g, ''));
    if (montoPagado > saldo) {
      toast.error(`El monto pagado no puede exceder el saldo de ${formatNumber(saldo.toString())}`);
      return;
    }

    const updatedData = {
      ...data,
      orden_de_servicio: id,
      fecha_de_pago: e.target.fecha_de_pago.value,
      monto_pagado: e.target.monto_pagado.value.replace(/\./g, ''), // Eliminar puntos antes de enviar
      forma_de_pago: e.target.forma_de_pago.value,
      numero_de_factura: e.target.numero_de_factura.value,
      comprobante: e.target.comprobante.value,
    };

    const api = authenticatedApi();
    api.post("/orden_de_servicio_detalles", updatedData)
      .then((res) => {
        console.log(res);
        toast.success("Guardado con éxito!");
        setTimeout(() => {
          onRequestClose(); // Cierra el modal
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error al guardar el registro, verifique los datos.");
      });
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onSubmit={handleSubmit} >
          <div className="row">
            <div className="form-group col-md-6 col-sm-12">
              <label>Fecha de Pago</label>
              <input
                type="date"
                autoFocus
                className="form-control"
                id="fecha_de_pago"
                required
                value={data.fecha_de_pago}
                onChange={(e) => setData({ ...data, fecha_de_pago: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6 col-sm-12">
              <label>Monto Pagado</label>
              <input
                type="text" // Cambiado de "number" a "text"
                className="form-control"
                id="monto_pagado"
                placeholder="Monto Pagado"
                required
                value={data.monto_pagado}
                onChange={(e) => setData({ ...data, monto_pagado: formatNumber(e.target.value) })}
              />
            </div>
            <div className="form-group col-md-6 col-sm-12">
              <label>Forma de Pago</label>
              <select
                className="form-control"
                id="forma_de_pago"
                value={data.forma_de_pago}
                onChange={(e) => setData({ ...data, forma_de_pago: e.target.value })}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6 col-sm-12">
              <label>Número de Factura</label>
              <input
                type="text"
                className="form-control"
                id="numero_de_factura"
                placeholder="Número de Factura"
                value={data.numero_de_factura}
                onChange={(e) => setData({ ...data, numero_de_factura: e.target.value })}
              />
            </div>
            <div className="form-group col-md-6 col-sm-12">
              <label>Número de Comprobante</label>
              <input
                type="text"
                className="form-control"
                id="comprobante"
                placeholder="Número de Comprobante"
                value={data.comprobante}
                onChange={(e) => setData({ ...data, comprobante: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-info">
              Guardar
            </button>
            <button className="btn btn-danger" onClick={onRequestClose}>
              Cerrar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default MyModal;
