import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { authenticatedApi } from './interfaces/api';
import { Responsable } from './interfaces/responsable';
import { toast } from 'react-toastify';
import moment from 'moment';

const customStyles: Modal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
};

interface ModalVerResponsableProps {
  isOpen: boolean;
  onRequestClose: () => void;
  responsableId: number | null;
}

const ModalVerResponsable: React.FC<ModalVerResponsableProps> = ({ isOpen, onRequestClose, responsableId }) => {
  const [data, setData] = useState<Responsable | null>(null);

  useEffect(() => {
    if (responsableId !== null) {
      authenticatedApi()
        .get(`/responsable/${responsableId}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error('Error al obtener los datos del responsable:', error);
          toast.error('Error al cargar los datos del responsable');
        });
    }
  }, [responsableId]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Detalles del Responsable"
    >
      {data ? (
        <div>
          <h2>Datos del Responsable</h2>
          <div className="row">
            <div className="col-md-6">
              <p><strong>ID:</strong> {data.id}</p>
              <p><strong>Nombre:</strong> {data.nombre}</p>
              <p><strong>Apellido:</strong> {data.apellido}</p>
              <p><strong>Fecha de Nacimiento:</strong> {moment(data.fecha_nacimiento).format('DD/MM/YYYY')}</p>
              <p><strong>Ocupacion:</strong> {data.ocupacion}</p>
              <p><strong>Notificación:</strong> {data.notificacion}</p>
              <p><strong> Tipo de Documento:</strong> {data.tipo_documento}</p>
              <p><strong> Número de Documento:</strong> {data.numero_documento}</p>
              <p><strong>Celular:</strong> {data.celular}</p>
              <p><strong>Email:</strong> {data.email}</p>
            </div>
            <div className="col-md-6">
              <p><strong>País:</strong> {data.pais}</p>
              <p><strong>Departamento:</strong> {data.departamento}</p>
              <p><strong>Ciudad:</strong> {data.ciudad}</p>
              <p><strong>Barrio:</strong> {data.barrio}</p>
              <p><strong>Dirección:</strong> {data.direccion}</p>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-secondary mr-2" onClick={onRequestClose}>Cerrar</button>
          </div>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </Modal>
  );
};

export default ModalVerResponsable;
