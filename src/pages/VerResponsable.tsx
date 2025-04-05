import React, { useState, useEffect, useRef } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Responsable } from "./interfaces/responsable";
import { toast } from 'react-toastify';

const VerResponsable = () => {
  const [data, setData] = useState<Responsable | null>(null);
  const { id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/responsable/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
      })
  }, [id]);

  const handleEliminar = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (confirmacion) {
      const api = authenticatedApi();
      api.delete(`/responsable/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // La eliminación fue exitosa
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/responsable");
            }, 3000);
          } else {
            // Ocurrió un error en la eliminación
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el responsable ya tiene registros en la tabla usuarios.");
        });
    }
  };



  return (
    <div>
      <ContentHeader title="Detalles del Responsable" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Datos del Responsable</h3>
                <div className="card-tools">
                  <Link
                    className="btn bg-maroon"
                    to="#"
                    onClick={handleEliminar}
                  >
                    Eliminar Responsable
                  </Link>
                  <Link
                    className="btn bg-teal"
                    to={`/responsable/editar/${data.id}`}
                  >
                    Editar Responsable
                  </Link>
                  <Link to={`/responsable`} className="btn btn-info">
                    Volver a la Lista
                  </Link>
                </div>
              </div>



              <div className={`card-body`}>
  <div className="row">
    <div className="col-md-6">
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Nombre:</strong> {data.nombre}</p>
      <p><strong>Apellido:</strong> {data.apellido}</p>
      <p><strong>Notificacion:</strong> {data.notificacion}</p>
      <p><strong>Documento:</strong> {data.tipo_documento}</p>
      <p><strong>Celular:</strong> {data.celular}</p>
      <p><strong>Email:</strong> {data.email}</p>
    </div>
    <div className="col-md-6">
      <p><strong>Pais:</strong> {data.pais}</p>
      <p><strong>Departamento:</strong> {data.departamento}</p>
      <p><strong>Ciudad:</strong> {data.ciudad}</p>
      <p><strong>Barrio:</strong> {data.barrio}</p>
      <p><strong>Dirección:</strong> {data.direccion}</p>
    </div>
  </div>
</div>


              <div className="card-footer"></div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VerResponsable;
