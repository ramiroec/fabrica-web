import React, { useState } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrearItemPlanInicial = () => {
    const [data, setData] = useState({
        item_descripcion: "",
    });
    const navigate = useNavigate();
    const handleSubmit = (e : any) => {
        e.preventDefault();

        const updatedData = {
            ...data,
            item_descripcion: e.target.item_descripcion.value
        
        };



        const api = authenticatedApi();
        api
            .post("/item_plan_inicial", updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate(`/item_plan_inicial/${res.data.id}`);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };

    return (
        <div>
            <ContentHeader title="Agregar Item del Plan Inicial" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información del Item</h3>
                            <div className="card-tools">
                                <Link to="/ListarItemPlanInicial" className="btn btn-info">
                                    Volver a la Lista
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group col-md-6">
                                    <label>Descripción del Item</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="item_descripcion"
                                        placeholder="Descripción del Item"
                                        required
                                        value={data.item_descripcion}
                                        onChange={(e) =>
                                            setData({ ...data, item_descripcion: e.target.value })
                                        }
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

export default CrearItemPlanInicial;
