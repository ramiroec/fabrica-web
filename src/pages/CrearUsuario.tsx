import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Perfil } from "./interfaces/perfil";
import { Departamento } from "./interfaces/departamento";
import { Usuario } from "./interfaces/usuario";

const CrearUsuario = () => {
    const [data, setData] = useState({
        usuario: "",
        contrasena: "",
        nombre: "",
        apellido: "",
        tipo_documento: "",
        numero_documento: "",
        perfil: "",
        email: "",
        telefono: "",
        estado: "",
        departamento: "",
        cargo: "",
        superior: ""
    });

    const [perfilOptions, setPerfilOptions] = useState<Perfil[]>([]);
    const [departamentoOptions, setDepartamentoOptions] = useState<Departamento[]>([]);
    const [usuarioOptions, setUsuarioOptions] = useState<Usuario[]>([]);
    useEffect(() => {
        authenticatedApi().get("/perfil").then(response => setPerfilOptions(response.data));
        authenticatedApi().get("/departamento").then(response => setDepartamentoOptions(response.data));
        authenticatedApi().get("/usuario").then(response => setUsuarioOptions(response.data));
    }, []);

    const navigate = useNavigate();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            usuario: e.target.usuario.value,
            contrasena: e.target.contrasena.value,
            nombre: e.target.nombre.value,
            apellido: e.target.apellido.value,
            tipo_documento: e.target.tipo_documento.value,
            numero_documento: e.target.numero_documento.value,
            perfil: e.target.perfil.value,
            email: e.target.email.value,
            telefono: e.target.telefono.value,
            estado: e.target.estado.value,
        };
        const api = authenticatedApi();
        api
            .post("/usuario", updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate(`/configuracion/usuario/${res.data.id}`);  // Asegúrate de que res.data.id tiene el ID correcto

                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };
    return (
        <div>
            <ContentHeader title="Agregar Usuario" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información del Usuario</h3>
                            <div className="card-tools">
                                <Link to="/usuario" className="btn btn-info">
                                    Volver a la Lista
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="row">
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
                                    <label>Apellido *</label>
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
                                    <label>Usuario *</label>
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
                                    <label>Contraseña *</label>
                                    <input
                                        type="text"
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
                                    <label>Tipo de Documento *</label>
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
                                    <label>Número de Documento *</label>
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
                                    <label>Perfil *</label>
                                    <select
                                        className="form-control"
                                        id="perfil"
                                        value={data.perfil}
                                        required
                                        onChange={(e) =>
                                            setData({ ...data, perfil: e.target.value })
                                        }
                                    >
                                        <option value="">Seleccionar Perfil</option>
                                        {perfilOptions.map((perfil) => (
                                            <option key={perfil.id} value={perfil.id}>
                                                {perfil.descripcion}
                                            </option>
                                        ))}
                                    </select>
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
                                    <label>Estado</label>
                                    <select
                                        className="form-control"
                                        id="estado"
                                        value={data.estado}
                                        onChange={(e) => setData({ ...data, estado: e.target.value })}
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Departamento</label>
                                    <select className="form-control" value={data.departamento}
                                        onChange={(e) => setData({ ...data, departamento: e.target.value })}>
                                        <option value="">Seleccionar Departamento</option>
                                        {departamentoOptions.map((dep) => (
                                            <option key={dep.id} value={dep.id}>{dep.descripcion}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Nuevo campo: Cargo */}
                                <div className="form-group col-md-6">
                                    <label>Cargo</label>
                                    <select className="form-control" value={data.cargo} onChange={(e) => setData({ ...data, cargo: e.target.value })}>
                                        <option value="">Seleccione un cargo</option>
                                        <option value="Gerente de Ventas">Gerente de Ventas</option>
                                        <option value="Ejecutivo de Ventas">Ejecutivo de Ventas</option>
                                        <option value="Representante de Servicio al Cliente">Representante de Servicio al Cliente</option>
                                        <option value="Gerente de Contabilidad">Gerente de Contabilidad</option>
                                        <option value="Contador">Contador</option>
                                        <option value="Asistente Contable">Asistente Contable</option>
                                        <option value="Gerente de Recursos Humanos">Gerente de Recursos Humanos</option>
                                        <option value="Especialista en Reclutamiento">Especialista en Reclutamiento</option>
                                        <option value="Gerente de TI">Gerente de TI</option>
                                        <option value="Analista de Sistemas">Analista de Sistemas</option>
                                        <option value="Administrador de Redes">Administrador de Redes</option>
                                    </select>
                                </div>

                                {/* Nuevo campo: Superior */}
                                <div className="form-group col-md-6">
                                    <label>Superior</label>
                                    <select className="form-control" value={data.superior}
                                        onChange={(e) => setData({ ...data, superior: e.target.value })}>
                                        <option value="">Seleccionar Superior</option>
                                        {usuarioOptions.map((user) => (
                                            <option key={user.id} value={user.id}>{user.nombre} {user.apellido}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                </div>

                                <button type="submit" className="btn btn-info">
                                    Guardar
                                </button>

                            </form>
                        </div>
                        <div className="card-footer">
                            <small>* Campos obligatorios: favor completar estos campos.</small>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default CrearUsuario;