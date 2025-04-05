import React, { useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { authenticatedApi } from "./interfaces/api";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  },
};

interface ModalIngresoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  handleAgregarIngreso: (nuevoIngreso: any) => void;
}

const ModalIngreso: React.FC<ModalIngresoProps> = ({ isOpen, onRequestClose, handleAgregarIngreso }) => {
  const today = new Date().toISOString().split('T')[0];

  const [nuevoIngreso, setNuevoIngreso] = useState({
    fecha: today,
    descripcion: "",
    monto: "",
  });

  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());

  const formatCurrency = (value: string) => {
    const numberValue = parseFloat(value.replace(/\./g, '').replace(/,/g, ''));
    return new Intl.NumberFormat('es-PY').format(numberValue);
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setNuevoIngreso({ ...nuevoIngreso, monto: formattedValue });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const updatedData = {
      fecha: nuevoIngreso.fecha,
      descripcion: e.target.descripcion.value,
      monto: parseFloat(nuevoIngreso.monto.replace(/\./g, '').replace(/,/g, '')), // Convierte el monto a número
    };

    const api = authenticatedApi();
    api.post("/ingreso", updatedData)
      .then((response) => {
        handleAgregarIngreso(response.data);
        Swal.fire({
          title: 'Éxito',
          text: 'Ingreso agregado',
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
        setNuevoIngreso({
          fecha: today,
          descripcion: "",
          monto: "",
        });
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error al insertar ingreso:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al insertar ingreso',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      });
  };

  const handleLoadOS = () => {
    if (selectedMonth) {
      const mes = selectedMonth.getMonth() + 1;
      const ano = selectedMonth.getFullYear();
      authenticatedApi()
        .get(`/ingreso/orden?mes=${mes}&ano=${ano}`) // Endpoint para obtener todas las órdenes de servicio del mes y año seleccionados
        .then((response) => {
          const totalMonto = response.data.reduce((sum: number, orden: any) => sum + parseFloat(orden.monto_pagado), 0);
          setNuevoIngreso((prevState) => ({
            ...prevState,
            monto: formatCurrency(totalMonto.toString()),
          }));
          Swal.fire({
            title: 'Información cargada',
            text: 'Se han cargado los montos de las órdenes de servicio.',
            icon: 'info',
            confirmButtonText: 'Cerrar'
          });
        })
        .catch((error) => {
          console.error('Error al cargar montos de las órdenes de servicio:', error);
          Swal.fire({
            title: 'Error',
            text: 'Error al cargar montos de las órdenes de servicio',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Ingreso Modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group col-md-4">
            <label>Fecha</label>
            <input
              type="date"
              className="form-control"
              name="fecha"
              value={nuevoIngreso.fecha}
              readOnly
            />
          </div>
          <div className="form-group col-md-4">
            <label>Descripción</label>
            <input
              type="text"
              className="form-control"
              name="descripcion"
              value={nuevoIngreso.descripcion}
              onChange={(e) => setNuevoIngreso({ ...nuevoIngreso, descripcion: e.target.value })}
              required
            />
          </div>
          <div className="form-group col-md-4">
            <label>Monto (Gs)</label>
            <input
              type="text"
              className="form-control"
              name="monto"
              value={nuevoIngreso.monto}
              onChange={handleMontoChange}
              required
            />
          </div>
        </div>
        <div className="form-group col-md-4">
          <label>Seleccionar Mes</label>
          <DatePicker
            selected={selectedMonth}
            onChange={(date: Date | null) => setSelectedMonth(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="form-control"
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-info">Guardar</button>
          <button type="button" className="btn btn-danger" onClick={onRequestClose}>Cerrar</button>
        </div>
        <div className="mt-3">
          <button type="button" className="btn btn-warning" onClick={handleLoadOS}>Cargar todas las OS</button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalIngreso;
