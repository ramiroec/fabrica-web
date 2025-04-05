import React, { useState } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CrearServicio = () => {
    const [data, setData] = useState({
        descripcion: "",
        cantidad_especialidad: "1",
        veces_semana: "1",
    });
    const navigate = useNavigate();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            descripcion: e.target.descripcion.value,
            cantidad_especialidad: e.target.cantidad_especialidad.value,
            veces_semana: e.target.veces_semana.value,
        };
        const api = authenticatedApi();
        api
            .post("/servicio", updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate(`/servicio/${res.data.id}`);  // Asegúrate de que res.data.id tiene el ID correcto

                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };
    return (
        <div>
            <ContentHeader title="Agregar servicio" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">

                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información del Servicio</h3>
                            <div className="card-tools">
                                <Link to="/servicio" className="btn btn-info">
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
                                    <label>cantidad de especialidades</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="cantidad_especialidad"
                                        placeholder="cantidad_especialidad"
                                        required
                                        min="1" // Especifica el valor mínimo permitido
                                        value={data.cantidad_especialidad}
                                        onChange={(e) => {
                                            setData({ ...data, cantidad_especialidad: e.target.value });
                                        }}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label>veces por semana</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="veces_semana"
                                        placeholder="veces_semana"
                                        required
                                        min="1" // Especifica el valor mínimo permitido
                                        value={data.veces_semana}
                                        onChange={(e) => {
                                            setData({ ...data, veces_semana: e.target.value });
                                        }}
                                    />
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
export default CrearServicio;