import { useState, useEffect } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Proveedor } from "./interfaces/proveedor";
import { toast } from 'react-toastify';

const VerProveedor = () => {
  const [data, setData] = useState<Proveedor | null>(null);
  const { id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/proveedor/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del proveedor:", error);
        toast.error("Error al cargar los datos del proveedor");
      });
  }, [id]);

  const handleEliminar = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (confirmacion) {
      const api = authenticatedApi();
      api.delete(`/proveedor/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/Listarproveedor");
            }, 3000);
          } else {
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el proveedor ya tiene registros.");
        });
    }
  };

  return (
    <div>
      <ContentHeader title="Detalles del Proveedor" />
      <section className="content">
        <div className="container-fluid">
          {data && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Datos del Proveedor</h3>
                <div className="card-tools">
                  <Link
                    className="btn bg-maroon"
                    to="#"
                    onClick={handleEliminar}
                  >
                    Eliminar Proveedor
                  </Link>
                  <Link
                    className="btn bg-teal"
                    to={`/configuracion/proveedor/editar/${data.id}`}
                  >
                    Editar Proveedor
                  </Link>
                  <Link to={`/configuracion/proveedor`} className="btn btn-info">
                    Volver a la Lista
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Razón Social:</strong> {data.razon_social}</p>
                    <p><strong>Nombre de Fantasía:</strong> {data.nombre_fantasia}</p>
                    <p><strong>Tipo de Documento:</strong> {data.tipo_documento}</p>
                    <p><strong>Numero de Documento:</strong> {data.numero_documento}</p>
                    <p><strong>País:</strong> {data.pais}</p>
                    <p><strong>Departamento:</strong> {data.departamento}</p>
                    <p><strong>Ciudad:</strong> {data.ciudad}</p>
                    <p><strong>Barrio:</strong> {data.barrio}</p>
                    <p><strong>Dirección:</strong> {data.direccion}</p>
                    <p><strong>Teléfono:</strong> {data.telefono}</p>
                    <p><strong>Correo Electrónico:</strong> {data.email}</p>
                    <p><strong>Contacto:</strong> {data.nombre_contacto}</p>
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

export default VerProveedor;
