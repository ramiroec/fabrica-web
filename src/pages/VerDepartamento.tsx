import { useState, useEffect } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Departamento } from "./interfaces/departamento"; // Asegúrate de crear esta interfaz
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerDepartamento = () => {
  const [data, setData] = useState<Departamento | null>(null);
  const { id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  // Obtener los datos del departamento al cargar el componente
  useEffect(() => {
    const url = `/departamento/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        toast.error("Error al cargar el departamento");
      });
  }, [id]);

  // Manejar la eliminación del departamento
  const handleEliminar = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este departamento?");
    if (confirmacion) {
      const api = authenticatedApi();
      api.delete(`/departamento/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // La eliminación fue exitosa
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/configuracion/departamento");
            }, 3000);
          } else {
            // Ocurrió un error en la eliminación
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el departamento ya tiene registros asociados.");
        });
    }
  };

  return (
    <div>
      <ContentHeader title="Detalles del Departamento" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Datos del Departamento</h3>
                <div className="card-tools">
                  <Link
                    className="btn bg-maroon"
                    to="#"
                    onClick={handleEliminar}
                  >
                    Eliminar Departamento
                  </Link>
                  <Link
                    className="btn bg-teal"
                    to={`/configuracion/departamento/editar/${data.id}`}
                  >
                    Editar Departamento
                  </Link>
                  <Link to={`/configuracion/departamento`} className="btn btn-info">
                    Volver a la Lista
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <p><strong>ID:</strong> {data.id}</p>
                    <p><strong>Descripción:</strong> {data.descripcion}</p>
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

export default VerDepartamento;