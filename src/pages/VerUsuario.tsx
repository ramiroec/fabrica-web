import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Usuario } from "./interfaces/usuario";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const VerUsuario = ({ isClearfix = false }: { isClearfix?: boolean }) => {
  const [data, setData] = useState<Usuario | null>(null);
  const [isCollapsed1, setIsCollapsed1] = useState(false);
  const [isCollapsed2, setIsCollapsed2] = useState(false);
  const { id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/usuario/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        toast.error("Error al cargar el usuario");
      });
  }, [id]);

  const authentication = useSelector((state: any) => state.auth.authentication);
  const perfil = authentication.profile.perfil;

  const handleEliminar = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (confirmacion) {
      const api = authenticatedApi();
      api.delete(`/usuario/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/configuracion/usuario");
            }, 3000);
          } else {
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error al eliminar");
        });
    }
  };

  const toggleCollapse1 = () => {
    setIsCollapsed1(!isCollapsed1);
  };

  const toggleCollapse2 = () => {
    setIsCollapsed2(!isCollapsed2);
  };

  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Usuario</h3>
                <button className="btn btn-tool" onClick={toggleCollapse1}>
                  {isCollapsed1 ? (
                    <i className="fas fa-plus"></i>
                  ) : (
                    <i className="fas fa-minus"></i>
                  )}
                </button>
                {perfil !== 3 && (
                  <div className="card-tools">
                    <Link className="btn bg-maroon" to="#" onClick={handleEliminar}>
                      Eliminar Usuario
                    </Link>
                    <Link
                      className="btn bg-teal"
                      to={`/configuracion/usuario/editar/${data.id}`}
                    >
                      Editar Usuario
                    </Link>
                    <Link to={`/configuracion/usuario`} className="btn btn-info">
                      Volver a la Lista
                    </Link>
                  </div>
                )}
              </div>
              <div className={`card-body ${isCollapsed1 ? 'collapse' : ''}`}>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Usuario:</strong> {data.usuario}</p>
                    <p><strong>Nombre:</strong> {data.nombre}</p>
                    <p><strong>Apellido:</strong> {data.apellido}</p>
                    <p><strong>Tipo de Documento:</strong> {data.tipo_documento}</p>
                    <p><strong>Número de Documento:</strong> {data.numero_documento}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Perfil:</strong> {data.perfil_descripcion}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Teléfono:</strong> {data.telefono}</p>
                    <p><strong>Estado:</strong> {data.estado}</p>
                  </div>
                </div>
              </div>
              {perfil !== 3 && (
                <div>
                  <div className="card-header">
                    <h3 className="card-title">Administrativo</h3>
                    <button className="btn btn-tool" onClick={toggleCollapse2}>
                      {isCollapsed2 ? (
                        <i className="fas fa-plus"></i>
                      ) : (
                        <i className="fas fa-minus"></i>
                      )}
                    </button>
                  </div>
                  <div className={`card-body ${isCollapsed2 ? 'collapse' : ''}`}>
                  <div className="col-md-6">
                  <p><strong>Departamento:</strong> {data.departamento_descripcion || "No asignado"}</p>
                    <p><strong>Cargo:</strong> {data.cargo || "No asignado"}</p>
                    <p><strong>Superior:</strong> {data.superior_nombre || "No asignado"}</p>
                  </div>
                  </div>
                  <div className={`card-footer ${isCollapsed2 ? 'collapse' : ''}`}></div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VerUsuario;