import { useState, useEffect } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Plan } from "./interfaces/plan";
import { toast } from 'react-toastify';

const VerPlan = () => {
  const [data, setData] = useState<Plan | null>(null);
  const { id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/plan/${id}`;
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
      api.delete(`/plan/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // La eliminación fue exitosa
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/plan");
            }, 3000);
          } else {
            // Ocurrió un error en la eliminación
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el plan ya tiene registros.");
        });
    }
  };

  return (
    <div>
      <ContentHeader title="Detalles del Plan" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Datos del Plan</h3>
                <div className="card-tools">
                  <Link
                    className="btn bg-maroon"
                    to="#"
                    onClick={handleEliminar}
                  >
                    Eliminar Plan
                  </Link>
                  <Link
                    className="btn bg-teal"
                    to={`/plan/editar/${data.id}`}
                  >
                    Editar Plan
                  </Link>
                  <Link to={`/plan`} className="btn btn-info">
                    Volver a la Lista
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Descripción:</strong> {data.descripcion}</p>
                    <p><strong>Observación:</strong> {data.observacion}</p>
                    <p><strong>Estado:</strong> {data.estado}</p>
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

export default VerPlan;
