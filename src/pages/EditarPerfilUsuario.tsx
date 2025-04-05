import React, { useState, useEffect, FormEvent } from "react";
import { authenticatedApi } from "./interfaces/api";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

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
    isOpen: boolean;
    onRequestClose: () => void;
}

const EditarPerfilUsuario: React.FC<ModalProps> = ({ isOpen, onRequestClose }) => {
    const [data, setData] = useState({
        usuario: "",
        contrasena: "",
        nombre: "",
        apellido: "",
        tipo_documento: "",
        numero_documento: "",
        email: "",
        telefono: "",
    });

    const authentication = useSelector((state: any) => state.auth.authentication);
    const dispatch = useDispatch();
    const id = `${authentication.profile.id}`
    useEffect(() => {
        authenticatedApi()
        .get(`/usuario/${authentication.profile.id}`)
        .then((res) => {
            setData(res.data);
        })
    }, [id]);


    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        try {
            const api = authenticatedApi();
            let newData = { ...data }; // Copia de los datos actuales
            //console.log(newData)
            //return
            await api.put(`/usuario/perfil/${id}`, newData);
            toast.success("Guardado con éxito!");

            // Refresca la página después de un breve retraso para ver los cambios en la foto de perfil
            setTimeout(() => {
                window.location.reload(); 
            }, 3000);
            } catch (error) {
                console.error(error);
                toast.error("Error al guardar");
              }
        }
        return (
            <>
                <style>{responsiveStyles}</style>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={onRequestClose}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <form onSubmit={handleSubmit} className="row">
                        <div className="form-group col-md-6">
                            Editar Perfil
                        </div>

                        <div className="form-group col-md-6">
                            <button type="button" className="btn btn-danger" onClick={onRequestClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <i className="fa fa-fw fa-times"></i>
                            </button>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Nombre</label>
                            <input
                                type="text"
                                autoFocus
                                className="form-control"
                                id="nombre"
                                placeholder="Nombre"
                                required
                                value={data.nombre}
                                onChange={(e) =>
                                    setData({ ...data, nombre: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Apellido</label>
                            <input
                                type="text"
                                autoFocus
                                className="form-control"
                                id="apellido"
                                placeholder="Apellido"
                                required
                                value={data.apellido}
                                onChange={(e) =>
                                    setData({ ...data, apellido: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
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
                        <div className="form-group col-md-6">
                            <label>Número de Documento</label>
                            <input
                                type="text"
                                autoFocus
                                className="form-control"
                                id="numero_documento"
                                placeholder="Numero de Documento"
                                required
                                value={data.numero_documento}
                                onChange={(e) =>
                                    setData({ ...data, numero_documento: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="usuario"
                                placeholder="Usuario"
                                required
                                value={data.usuario}
                                onChange={(e) =>
                                    setData({ ...data, usuario: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="contrasena"
                                placeholder="Contraseña"
                                required
                                value={data.contrasena}
                                onChange={(e) =>
                                    setData({ ...data, contrasena: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Email</label>
                            <input
                                type="text"
                                autoFocus
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                required
                                value={data.email}
                                onChange={(e) =>
                                    setData({ ...data, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Teléfono (WhatsApp)</label>
                            <input
                                type="text"
                                autoFocus
                                className="form-control"
                                id="telefono"
                                placeholder="Teléfono"
                                required
                                value={data.telefono}
                                onChange={(e) =>
                                    setData({ ...data, telefono: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group col-md-6">
                        <button type="submit" className="btn btn-info">
                            Guardar
                        </button>
                        </div>
                    </form>
                </Modal>
            </>
        );
    };
    export default EditarPerfilUsuario;