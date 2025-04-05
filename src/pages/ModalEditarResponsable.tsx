import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { authenticatedApi } from "./interfaces/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Departamentos from "./interfaces/departamentos";
import Ciudades from "./interfaces/ciudades";

type Departamento = keyof typeof Ciudades;
type Ciudad = typeof Ciudades[Departamento][number];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bottom: 'auto',
    height: '80vh',
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

interface ModalEditarResponsableProps {
  isOpen: boolean;
  onRequestClose: () => void;
  responsableId: number | null;
}

const ModalEditarResponsable: React.FC<ModalEditarResponsableProps> = ({ isOpen, onRequestClose, responsableId }) => {
  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    notificacion: "",
    tipo_documento: "",
    fecha_nacimiento: "",
    ocupacion: "",
    numero_documento: "",
    celular: "",
    email: "",
    pais: "",
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
  });

  useEffect(() => {
    if (responsableId) {
      authenticatedApi()
        .get(`/responsable/${responsableId}`)
        .then((res) => {
          setData(res.data);
        });
    }
  }, [responsableId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData = {
      ...data,
      nombre: e.currentTarget.nombre.value,
      apellido: e.currentTarget.apellido.value,
      notificacion: e.currentTarget.notificacion.value,
      tipo_documento: e.currentTarget.tipo_documento.value,
      ocupacion: e.currentTarget.ocupacion.value,
      numero_documento: e.currentTarget.numero_documento.value,
      celular: e.currentTarget.celular.value,
      email: e.currentTarget.email.value,
      pais: e.currentTarget.pais.value,
      departamento: e.currentTarget.departamento.value,
      ciudad: e.currentTarget.ciudad.value,
      barrio: e.currentTarget.barrio.value,
      direccion: e.currentTarget.direccion.value,
    };

    authenticatedApi()
      .put(`/responsable/${responsableId}`, updatedData)
      .then((res) => {
        toast.success("Guardado con éxito!");
        setTimeout(() => {
          onRequestClose();
        }, 3000);
      })
      .catch((err) => {
        toast.error("Error al guardar el registro, verifique los datos: numero de cedula no puede ser repetido.");
      });
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Editar Responsable"
      >
        <div>
          <h3>Editar Responsable</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group col-md-6 col-sm-12">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Nombre"
                  required
                  value={data.nombre}
                  onChange={(e) => setData({ ...data, nombre: e.target.value })}
                />
              </div>
              <div className="form-group col-md-6 col-sm-12">
                <label>Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  placeholder="Apellido"
                  required
                  value={data.apellido}
                  onChange={(e) => setData({ ...data, apellido: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-4 col-sm-12">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha_nacimiento"
                  value={data.fecha_nacimiento}
                  onChange={(e) => setData({ ...data, fecha_nacimiento: e.target.value })}
                />
              </div>
              <div className="form-group col-md-4 col-sm-12">
                <label>Ocupación</label>
                <input
                  type="text"
                  className="form-control"
                  id="ocupacion"
                  placeholder="Ocupación"
                  value={data.ocupacion}
                  onChange={(e) => setData({ ...data, ocupacion: e.target.value })}
                />
              </div>
              <div className="form-group col-md-4 col-sm-12">
                <label>Notificación</label>
                <select
                  className="form-control"
                  id="notificacion"
                  value={data.notificacion}
                  onChange={(e) => setData({ ...data, notificacion: e.target.value })}
                >
                  <option value="Si">Si</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 col-sm-12">
                <label>Tipo de Documento</label>
                <select
                  className="form-control"
                  id="tipo_documento"
                  value={data.tipo_documento}
                  onChange={(e) => setData({ ...data, tipo_documento: e.target.value })}
                >
                  <option value="Cédula">Cédula</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div className="form-group col-md-6 col-sm-12">
                <label>Número de Documento</label>
                <input
                  type="text"
                  className="form-control"
                  id="numero_documento"
                  placeholder="Documento"
                  value={data.numero_documento}
                  onChange={(e) => setData({ ...data, numero_documento: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 col-sm-12">
                <label>Celular</label>
                <input
                  type="text"
                  className="form-control"
                  id="celular"
                  placeholder="Celular"
                  required
                  value={data.celular}
                  onChange={(e) => setData({ ...data, celular: e.target.value })}
                />
              </div>
              <div className="form-group col-md-6 col-sm-12">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              <div className="form-group col-md-4 col-12">
                <label>País</label>
                <select
                  className="form-control"
                  id="pais"
                  value={data.pais}
                  onChange={(e) => setData({ ...data, pais: e.target.value })}
                >
                  <option value="Alemania">Alemania</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Australia">Australia</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Canadá">Canadá</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Corea del Sur">Corea del Sur</option>
                  <option value="España">España</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Francia">Francia</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Italia">Italia</option>
                  <option value="Japón">Japón</option>
                  <option value="México">México</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Perú">Perú</option>
                  <option value="Polonia">Polonia</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Rusia">Rusia</option>
                  <option value="Sudáfrica">Sudáfrica</option>
                  <option value="Suiza">Suiza</option>
                  <option value="Turquía">Turquía</option>
                  <option value="Ucrania">Ucrania</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Venezuela">Venezuela</option>
                </select>
              </div>
              <div className="form-group col-md-4 col-sm-12">
                <label>Departamento </label>
                <select
                  className="form-control"
                  id="departamento"
                  value={data.departamento}
                  onChange={(e) => {
                    const selectedDepartamento = e.target.value as Departamento;
                    const defaultCiudad = selectedDepartamento in Ciudades ? Ciudades[selectedDepartamento][0] : "";
                    setData({
                      ...data,
                      departamento: selectedDepartamento,
                      ciudad: defaultCiudad,
                    });
                  }}
                >
                  <option value="">Seleccionar el Departamento</option>
                  {Departamentos.map((departamento) => (
                    <option key={departamento} value={departamento}>
                      {departamento}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-4 col-sm-12">
                <label>Ciudad</label>
                <select
                  className="form-control"
                  id="ciudad"
                  value={data.ciudad}
                  onChange={(e) => setData({ ...data, ciudad: e.target.value })}
                >
                  <option value="">Seleccionar la Ciudad</option>
                  {data.departamento &&
                    Ciudades[data.departamento as Departamento].map((ciudad) => (
                      <option key={ciudad} value={ciudad}>
                        {ciudad}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 col-sm-12">
                <label>Barrio</label>
                <input
                  type="text"
                  className="form-control"
                  id="barrio"
                  placeholder="Barrio"
                  value={data.barrio}
                  onChange={(e) => setData({ ...data, barrio: e.target.value })}
                />
              </div>
              <div className="form-group col-md-6 col-sm-12">
                <label>Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  placeholder="Dirección"
                  value={data.direccion}
                  onChange={(e) => setData({ ...data, direccion: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ModalEditarResponsable;
