import React, { useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { authenticatedApi } from "./interfaces/api";
import { Proveedor } from "./interfaces/proveedor";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bottom: 'auto',
    height: 'auto',
    maxHeight: '90vh',
    overflow: 'auto',
    paddingBottom: '20px',
    padding: '20px',
  },
};

interface ModalEgresoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  handleAgregarEgreso: (nuevoEgreso: any) => void;
  proveedores: Proveedor[];
}

const ModalEgreso: React.FC<ModalEgresoProps> = ({ isOpen, onRequestClose, handleAgregarEgreso, proveedores }) => {
  const today = new Date().toISOString().split('T')[0];

  const [nuevoEgreso, setNuevoEgreso] = useState({
    proveedor_id: "",
    proveedor_nombre: "",
    ruc_proveedor: "",
    fecha: today,
    tipo_timbrado: "",
    detalle: "",
    descripcion: "",
    monto_10: "",
    monto_5: "",
    monto_exento: "",
    monto: "",
    iva_10: "",
    iva_5: "",
    iva: "",
  });

  const handleProveedorChange = (e: any) => {
    const selectedProveedor = proveedores.find((p: Proveedor) => p.id === parseInt(e.target.value));
    setNuevoEgreso({
      ...nuevoEgreso,
      proveedor_id: selectedProveedor ? selectedProveedor.id.toString() : '',
      proveedor_nombre: selectedProveedor ? selectedProveedor.razon_social : '',
      ruc_proveedor: selectedProveedor ? selectedProveedor.numero_documento : '',
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const api = authenticatedApi();
    api.post("/egreso", {
      ...nuevoEgreso,
      monto_10: parseFloat(nuevoEgreso.monto_10.replace(/\./g, '').replace(/,/g, '') || "0"),
      monto_5: parseFloat(nuevoEgreso.monto_5.replace(/\./g, '').replace(/,/g, '') || "0"),
      monto_exento: parseFloat(nuevoEgreso.monto_exento.replace(/\./g, '').replace(/,/g, '') || "0"),
      monto: parseFloat(nuevoEgreso.monto.replace(/\./g, '').replace(/,/g, '') || "0"),
      iva_10: parseFloat(nuevoEgreso.iva_10.replace(/\./g, '').replace(/,/g, '') || "0"),
      iva_5: parseFloat(nuevoEgreso.iva_5.replace(/\./g, '').replace(/,/g, '') || "0"),
      iva: parseFloat(nuevoEgreso.iva.replace(/\./g, '').replace(/,/g, '') || "0")
    })
      .then((response) => {
        handleAgregarEgreso(response.data);
        Swal.fire({
          title: 'Éxito',
          text: 'Egreso agregado',
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
        setNuevoEgreso({
          proveedor_id: "",
          proveedor_nombre: "",
          ruc_proveedor: "",
          fecha: today,
          tipo_timbrado: "",
          detalle: "",
          descripcion: "",
          monto_10: "",
          monto_5: "",
          monto_exento: "",
          monto: "",
          iva_10: "",
          iva_5: "",
          iva: "",
        });
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error al insertar egreso:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al insertar egreso',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      });
  };

  const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value.replace(/\./g, '').replace(/,/g, ''));
    return isNaN(numberValue) ? '' : new Intl.NumberFormat('es-PY').format(numberValue);
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatCurrency(value);
    let newEgreso = { ...nuevoEgreso, [name]: formattedValue };

    if (name === "monto_10") {
      newEgreso.iva_10 = formatCurrency((parseFloat(value.replace(/\./g, '').replace(/,/g, '')) * 0.1).toString());
    } else if (name === "monto_5") {
      newEgreso.iva_5 = formatCurrency((parseFloat(value.replace(/\./g, '').replace(/,/g, '')) * 0.05).toString());
    }

    newEgreso.monto = formatCurrency((
      parseFloat(newEgreso.monto_10.replace(/\./g, '').replace(/,/g, '') || "0") + 
      parseFloat(newEgreso.monto_5.replace(/\./g, '').replace(/,/g, '') || "0") + 
      parseFloat(newEgreso.monto_exento.replace(/\./g, '').replace(/,/g, '') || "0")
    ).toString());

    newEgreso.iva = formatCurrency((
      parseFloat(newEgreso.iva_10.replace(/\./g, '').replace(/,/g, '') || "0") + 
      parseFloat(newEgreso.iva_5.replace(/\./g, '').replace(/,/g, '') || "0")
    ).toString());

    setNuevoEgreso(newEgreso);
  };

  const handleIVAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatCurrency(value);
    setNuevoEgreso({ ...nuevoEgreso, [name]: formattedValue });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Egreso Modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="modal-title">Egreso</h5>
          <button type="button" className="btn btn-danger" onClick={onRequestClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="form-group col-md-6">
              <label>Proveedor</label>
              <select className="form-control" value={nuevoEgreso.proveedor_id} onChange={handleProveedorChange}>
                <option value="">Seleccionar Proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>{proveedor.razon_social}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label>Nombre Proveedor</label>
              <input type="text" className="form-control" value={nuevoEgreso.proveedor_nombre} readOnly />
            </div>
            <div className="form-group col-md-6">
              <label>ID Proveedor</label>
              <input type="text" className="form-control" value={nuevoEgreso.proveedor_id} readOnly />
            </div>
            <div className="form-group col-md-6">
              <label>RUC Proveedor</label>
              <input type="text" className="form-control" value={nuevoEgreso.ruc_proveedor} readOnly />
            </div>
            <div className="form-group col-md-6">
              <label>Fecha Factura</label>
              <input
                type="date"
                className="form-control"
                value={nuevoEgreso.fecha}
                onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, fecha: e.target.value })}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Tipo timbrado</label>
              <select
                className="form-control"
                value={nuevoEgreso.tipo_timbrado}
                onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, tipo_timbrado: e.target.value })}
              >
                <option value="">Seleccionar Tipo</option>
                <option value="Electronico">Electrónico</option>
                <option value="Fisico">Físico</option>
                <option value="Digital">Digital</option>
                <option value="NA">N/A</option>
              </select>
            </div>
            <div className="form-group col-md-6">
              <label>Detalle Producto/Servicio</label>
              <input
                type="text"
                className="form-control"
                name="detalle"
                value={nuevoEgreso.detalle}
                onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, detalle: e.target.value })}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={nuevoEgreso.descripcion}
                onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, descripcion: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="form-group col-md-6">
              <label>Monto factura 10%</label>
              <input
                type="text"
                className="form-control"
                name="monto_10"
                value={nuevoEgreso.monto_10}
                onChange={handleMontoChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>IVA 10%</label>
              <input
                type="text"
                className="form-control"
                name="iva_10"
                value={nuevoEgreso.iva_10}
                onChange={handleIVAChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Monto factura 5%</label>
              <input
                type="text"
                className="form-control"
                name="monto_5"
                value={nuevoEgreso.monto_5}
                onChange={handleMontoChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>IVA 5%</label>
              <input
                type="text"
                className="form-control"
                name="iva_5"
                value={nuevoEgreso.iva_5}
                onChange={handleIVAChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Monto factura Exento</label>
              <input
                type="text"
                className="form-control"
                name="monto_exento"
                value={nuevoEgreso.monto_exento}
                onChange={handleMontoChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Monto Factura (Gs)</label>
              <input
                type="text"
                className="form-control"
                name="monto"
                value={nuevoEgreso.monto}
                readOnly
              />
            </div>
            <div className="form-group col-md-6">
              <label>IVA</label>
              <input type="text" className="form-control" name="iva" value={nuevoEgreso.iva} readOnly />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalEgreso;
