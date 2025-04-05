import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditarPerfil = () => {
    const [data, setData] = useState({
        descripcion: "",
        observacion: "",
        estado: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();  
    useEffect(() => {  authenticatedApi()
      .get(`/perfil/${id}`)
        .then((res) => {
          setData(res.data);
        })}, [id]);
  
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            descripcion: e.target.descripcion.value,
            observacion: e.target.observacion.value,
            estado: e.target.estado.value,
        };
        const api = authenticatedApi();
        api
            .put(`/perfil/${id}`, updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate("/configuracion/perfil");
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };
    return (
        <div>
            <ContentHeader title="Agregar Perfil" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información</h3>
                            <div className="card-tools">
                                <Link to="/configuracion/perfil" className="btn btn-info">
                                    Volver a la Lista
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group col-md-6">
                                    <label>Descripción</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="descripcion"
                                        placeholder="Descripción"
                                        required
                                        value={data.descripcion}
                                        onChange={(e) =>
                                            setData({ ...data, descripcion: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Observación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="observacion"
                                        placeholder="Observación"
                                      
                                        value={data.observacion}
                                        onChange={(e) =>
                                            setData({ ...data, observacion: e.target.value })
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
export default EditarPerfil;