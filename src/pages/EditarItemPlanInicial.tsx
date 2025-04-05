import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditarItemPlanInicial = () => {
    const [data, setData] = useState({
        item_descripcion: "",
      
    });
    const navigate = useNavigate();
    const { id } = useParams();  
    useEffect(() => {  authenticatedApi()
      .get(`/item_plan_inicial/${id}`)
        .then((res) => {
          setData(res.data);
        })}, [id]);
  
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const updatedData = {
            ...data,
            item_descripcion: e.target.item_descripcion.value
        
        };
        const api = authenticatedApi();
        api
            .put(`/item_plan_inicial/${id}`, updatedData)
            .then((res) => {
                console.log(res);
                toast.success("Guardado con éxito!");
                setTimeout(() => {
                    navigate("/ListarItemPlanInicial");
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error al guardar el registro");
            });
    };
    return (
        <div>
            <ContentHeader title="Editar Item" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información</h3>
                            <div className="card-tools">
                                <Link to="/ListarItemPlanInicial" className="btn btn-info">
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
                                        id="item_descripcion"
                                        autoFocus
                                        className="form-control"
                                        placeholder="Descripción"
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
export default EditarItemPlanInicial;