import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { authenticatedApi } from "./interfaces/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bottom: 'auto',
        height: '400px',
        maxHeight: '140vh',
        overflow: 'auto',
        paddingBottom: '40px',
        width: '90%',
        maxWidth: '800px',
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
    usuario: string;
    isOpen: boolean;
    onRequestClose: () => void;
    onPagoInsertado: () => void;
    periodoPago: Date; // Add periodoPago as a prop
}

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const getFixedDate = (periodoPago: Date): string => {
    const today = new Date();
    return new Date(periodoPago.getFullYear(), periodoPago.getMonth(), today.getDate()).toISOString().split('T')[0];
};

const PagoEmpleadoModal: React.FC<ModalProps> = ({ isOpen, onRequestClose, onPagoInsertado, usuario, periodoPago }) => {
    const [data, setData] = useState({
        fecha: formatDate(new Date()), // Utiliza una función para formatear la fecha actual
        monto_pagado: '',
        forma_pago: 'Efectivo',
        observacion: ''
    });

    useEffect(() => {
        if (isOpen) {
            setData((prevState) => ({
                ...prevState,
                fecha: getFixedDate(periodoPago) // Siempre establece la fecha fija según el mes seleccionado
            }));
        }
    }, [isOpen, periodoPago]);

    useEffect(() => {
        if (!data.forma_pago) {
            setData((prevState) => ({
                ...prevState,
                forma_pago: 'Efectivo',
            }));
        }
    }, [isOpen]);

    const handleMontoPagadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\./g, '');
        const monto_pagado = Number(value);
        setData((prevState) => ({
            ...prevState,
            monto_pagado: new Intl.NumberFormat('de-DE').format(monto_pagado)
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...data,
            usuario: usuario,
            monto_pagado: data.monto_pagado.replace(/\./g, ''),
        };

        const selectedMonth = new Date(data.fecha).getUTCMonth() + 1; // Obtén el mes en UTC
        const selectedYear = new Date(data.fecha).getUTCFullYear(); // Obtén el año en UTC

        authenticatedApi()
            .post(`/pago_empleado_detalles/${selectedYear}/${selectedMonth}`, payload)
            .then(response => {
                toast.success('Pago guardado con éxito');
                onRequestClose();
                onPagoInsertado();
            })
            .catch(error => {
                toast.error('Error al guardar el pago');
                console.error('Error al guardar el pago:', error);
            });
    };

    return (
        <>
            <style>{responsiveStyles}</style>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                style={customStyles}
                contentLabel="Detalle de Pago"
            >
                <form onSubmit={handleSubmit} className="row">
                    <div className="form-group col-md-6">
                        <label>Fecha de Pago</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fecha"
                            required
                            value={data.fecha}
                            readOnly
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label>Monto Pagado</label>
                        <input
                            type="text"
                            className="form-control"
                            id="monto_pagado"
                            required
                            value={data.monto_pagado}
                            onChange={handleMontoPagadoChange}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label>Forma de Pago</label>
                        <select
                            className="form-control"
                            id="forma_pago"
                            required
                            value={data.forma_pago}
                            onChange={(e) => setData({ ...data, forma_pago: e.target.value })}
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label>Observación</label>
                        <textarea
                            className="form-control"
                            id="observacion"
                            value={data.observacion}
                            onChange={(e) => setData({ ...data, observacion: e.target.value })}
                        />
                    </div>
                    <div className="d-flex justify-content-between mt-3 w-100">
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

export default PagoEmpleadoModal;
