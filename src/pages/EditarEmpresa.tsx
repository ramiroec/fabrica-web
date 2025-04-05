import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Usuario } from "./interfaces/usuario";

const EditarEmpresa = () => {
    const [data, setData] = useState({
        razon_social: "",
        ruc: "",
        celular_salida: "",
        email: "",
        direccion: "",
        contacto_responsable: "",
        contacto_admin: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();  
    useEffect(() => {  authenticatedApi()
      .get(`/empresa/${id}`)
        .then((res) => {
          setData(res.data);
        })}, [id]);


    const [responsableOptions, setResponsableOptions] = useState<Usuario[]>([]);
    useEffect(() => {
        const url = `/usuario`;
        authenticatedApi()
            .get(url)
            .then((response) => {
                setResponsableOptions(response.data);
            })}, []);   

    const [adminOptions, setAdminOptions] = useState<Usuario[]>([]);
    useEffect(() => {
        const url = `/usuario`;
        authenticatedApi()
            .get(url)
            .then((response) => {
                setAdminOptions(response.data);
            })}, []);   

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            razon_social: e.target.razon_social.value,
            ruc: e.target.ruc.value,
            celular_salida: e.target.celular_salida.value,
            email: e.target.email.value,
            direccion: e.target.direccion.value,
            contacto_responsable: e.target.contacto_responsable.value,
            contacto_admin: e.target.contacto_admin.value,
        };
        const api = authenticatedApi();
        api
            .put(`/empresa/${id}`, updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate("/configuracion/empresa/1");
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };
    return (
        <div>
            <ContentHeader title="Agregar Empresa" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información</h3>
                            <div className="card-tools">
                                <Link to="/configuracion/empresa/1" className="btn btn-info">
                                    Volver a la Lista
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                        <form onSubmit={handleSubmit} className="row">
                                <div className="form-group col-md-6">
                                    <label>Razón Social</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="razon_social"
                                        placeholder="Razón Social"
                                        required
                                        value={data.razon_social}
                                        onChange={(e) =>
                                            setData({ ...data, razon_social: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>ruc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ruc"
                                        placeholder="RUC"
                                        required
                                        value={data.ruc}
                                        onChange={(e) =>
                                            setData({ ...data, ruc: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Celular</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="celular_salida"
                                        placeholder="Celular"
                                        required
                                        value={data.celular_salida}
                                        onChange={(e) =>
                                            setData({ ...data, celular_salida: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Email</label>
                                    <input
                                        type="text"
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
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="direccion"
                                        placeholder="Dirección"
                                        required
                                        value={data.direccion}
                                        onChange={(e) =>
                                            setData({ ...data, direccion: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contacto Responsable Dueño</label>
                                    <select
                                        className="form-control"
                                        id="contacto_responsable"
                                        value={data.contacto_responsable}
                                        onChange={(e) =>
                                            setData({ ...data, contacto_responsable: e.target.value })
                                        }
                                    >
                                        <option value="">Seleccionar Contacto Responsable</option>
                                        {responsableOptions.map((usuario) => (
                                            <option key={usuario.id} value={usuario.id}>
                                                {usuario.nombre_completo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contacto Administrativo</label>
                                    <select
                                        className="form-control"
                                        id="contacto_admin"
                                        value={data.contacto_admin}
                                        onChange={(e) =>
                                            setData({ ...data, contacto_admin: e.target.value })
                                        }
                                    >
                                        <option value="">Seleccionar Contacto Responsable</option>
                                        {responsableOptions.map((usuario) => (
                                            <option key={usuario.id} value={usuario.id}>
                                                {usuario.nombre_completo}
                                            </option>
                                        ))}
                                    </select>
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
export default EditarEmpresa;