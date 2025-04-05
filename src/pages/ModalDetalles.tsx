import React from 'react';
import Modal from 'react-modal';
import { Contabilidad } from './interfaces/contabilidad';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bottom: 'auto',
    height: 'auto',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: '20px',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
};

const responsiveStyles = `
  @media (max-width: 600px) {
    .ReactModal__Content {
      width: 90% !important;
      height: 90% !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }
  }
`;

const formatMonto = (monto: number) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(monto);
};

interface ModalDetallesProps {
  isOpen: boolean;
  onRequestClose: () => void;
  data: Contabilidad | null;
}

const ModalDetalles: React.FC<ModalDetallesProps> = ({ isOpen, onRequestClose, data }) => {
  if (!data) return null;

  return (
    <>
      <style>{responsiveStyles}</style>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Detalles del Movimiento"
      >
        <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '10px' }}>
          <h5 className="modal-title" style={{ margin: 0 }}>Detalles del Movimiento</h5>
          <button type="button" className="close" onClick={onRequestClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#000' }}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body" style={{ paddingTop: '10px' }}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Tipo de Movimiento:</label>
            <p>{data.tipo_movimiento}</p>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Fecha:</label>
            <p>{data.fecha}</p>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Descripción:</label>
            <p>{data.descripcion}</p>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Monto (Gs):</label>
            <p>{formatMonto(data.monto)}</p>
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', paddingTop: '10px', textAlign: 'right' }}>
          <button type="button" className="btn btn-secondary" onClick={onRequestClose} style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}>Cerrar</button>
        </div>
      </Modal>
    </>
  );
};

export default ModalDetalles;
