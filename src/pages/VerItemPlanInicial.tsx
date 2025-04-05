import { useState, useEffect } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Item_plan_inicial } from "./interfaces/item_plan_inicial";
import { toast } from 'react-toastify';

const VerItemPlanInicial = () => {
  const [data, setData] = useState<Item_plan_inicial | null>(null);
  const { id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/item_plan_inicial/${id}`;
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
      api.delete(`/item_plan_inicial/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // La eliminación fue exitosa
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/ListarItemPlanInicial");
            }, 3000);
          } else {
            // Ocurrió un error en la eliminación
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el item del plan inicial ya tiene registros.");
        });
    }
  };

  return (
    <div>
      <ContentHeader title="Detalles del Item del Plan Inicial" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Datos del Item del Plan Inicial</h3>
                <div className="card-tools">
                  <Link
                    className="btn bg-maroon"
                    to="#"
                    onClick={handleEliminar}
                  >
                    Eliminar Item
                  </Link>
                  <Link
                    className="btn bg-teal"
                    to={`/item_plan_inicial/editar/${data.id}`}
                  >
                    Editar Item
                  </Link>
                  <Link to={`/ListarItemPlanInicial`} className="btn btn-info">
                    Volver a la Lista
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Descripción:</strong> {data.item_descripcion}</p>
                    {/* Agrega aquí más campos según la estructura de ItemPlanInicial */}
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

export default VerItemPlanInicial;
