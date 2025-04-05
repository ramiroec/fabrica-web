import React, { useState } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CrearDepartamento = () => {
    const [data, setData] = useState({
        descripcion: "",
        estado: "Activo",
    });
    const navigate = useNavigate();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            descripcion: e.target.descripcion.value,
            estado: e.target.estado.value,
        };

        const api = authenticatedApi();
        api
            .post("/departamento", updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate(`/configuracion/departamento/${res.data.id}`); // Redirige al detalle del departamento creado
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };

    return (
        <div>
            <ContentHeader title="Agregar Departamento" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información del Departamento</h3>
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

export default CrearDepartamento;