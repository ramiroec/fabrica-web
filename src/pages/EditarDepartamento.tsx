import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarDepartamento = () => {
    const [data, setData] = useState({
        descripcion: "",
        estado: "",
    });
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID del departamento desde la URL

    // Obtener los datos del departamento al cargar el componente
    useEffect(() => {
        authenticatedApi()
            .get(`/departamento/${id}`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error("Error al obtener datos:", err);
                toast.error("Error al cargar el departamento");
            });
    }, [id]);

    // Manejar el envío del formulario
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            descripcion: e.currentTarget.descripcion.value,
            estado: e.currentTarget.estado.value,
        };

        const api = authenticatedApi();
        api
            .put(`/departamento/${id}`, updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate("/configuracion/departamento"); // Redirige a la lista de departamentos
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };

    return (
        <div>
            <ContentHeader title="Editar Departamento" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Editar Información del Departamento</h3>
                            <div className="card-tools">
                                <Link to="/configuracion/departamento" className="btn btn-info">
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

export default EditarDepartamento;