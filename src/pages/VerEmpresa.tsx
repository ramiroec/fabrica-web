import { useState, useEffect, useRef } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Empresa } from "./interfaces/empresa";
import { Feriado } from "./interfaces/feriado";
import { toast } from 'react-toastify';

const VerEmpresa = () => {
  // Estado para la información de la empresa
  const [dataEmpresa, setDataEmpresa] = useState<Empresa | null>(null);
  
  // Estado para manejar los feriados
  const [feriados, setFeriado] = useState<Feriado[]>([]);
  
  // Estado para indicar si los datos se están cargando
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar el formulario de agregar feriado
  const [data, setData] = useState({
    dia: "",
    mes: "",
    descripcion: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // Función para obtener los datos de la empresa
  useEffect(() => {
    const url = `/empresa/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setDataEmpresa(response.data);
      });
  }, [id]);

  // Función para obtener los feriados
  const fetchFeriados = () => {
    const url = `/feriado`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setFeriado(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFeriados();
  }, []);

  // Estados para manejar la colapsabilidad de las secciones
  const [isCollapsed1, setIsCollapsed1] = useState(false);
  const [isCollapsed2, setIsCollapsed2] = useState(false);
  
  // Función para alternar el colapso de la sección de configuración general
  const toggleCollapse1 = () => {
    setIsCollapsed1(!isCollapsed1);
  };

  // Función para alternar el colapso de la sección de feriados
  const toggleCollapse2 = () => {
    setIsCollapsed2(!isCollapsed2);
  };

  // Función para manejar el envío del formulario de agregar feriado
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const api = authenticatedApi();
    api
      .post("/feriado", data)
      .then((res) => {
        toast.success("Guardado con éxito!");
        fetchFeriados();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error al guardar el registro");
      });
  };

  // Función para manejar la eliminación de un feriado
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este feriado?')) {
      const api = authenticatedApi();
      api
        .delete(`/feriado/${id}`)
        .then((res) => {
          toast.success('Feriado eliminado con éxito!');
          fetchFeriados(); // Actualiza la lista de feriados
        })
        .catch((err) => {
          console.error(err);
          toast.error('Error al eliminar el feriado');
        });
    }
  };

  return (
    <div>
      <ContentHeader title="Detalles de la Empresa" />
      <section className="content">
        <div className="container-fluid">
          {dataEmpresa && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Configuración General de la Empresa</h3>
                <button className="btn btn-tool" onClick={toggleCollapse1}>
                  {isCollapsed1 ? <i className="fas fa-plus"></i> : <i className="fas fa-minus"></i>}
                </button>
                <div className="card-tools">
                  <Link className="btn bg-info" to={`/configuracion/empresa/editar/${dataEmpresa.id}`}>
                    Editar Empresa
                  </Link>
                </div>
              </div>
              <div className={`card-body ${isCollapsed1 ? 'collapse' : ''}`}>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Razón Social:</strong> {dataEmpresa.razon_social}</p>
                    <p><strong>Celular:</strong> {dataEmpresa.celular_salida}</p>
                    <p><strong>Dirección:</strong> {dataEmpresa.direccion}</p>
                    <p><strong>Contacto Responsable (dueño):</strong> {dataEmpresa.contacto_responsable_nombre_apellido}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>RUC:</strong> {dataEmpresa.ruc}</p>
                    <p><strong>Email:</strong> {dataEmpresa.email}</p>
                    <p><br></br></p>
                    <p><strong>Contacto Administrativo:</strong> {dataEmpresa.contacto_admin_nombre_apellido}</p>
                  </div>
                </div>
              </div>
              <div className="card-header">
                <h3 className="card-title">Feriados</h3>
                <button className="btn btn-tool" onClick={toggleCollapse2}>
                  {isCollapsed2 ? <i className="fas fa-plus"></i> : <i className="fas fa-minus"></i>}
                </button>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className={`card-body ${isCollapsed2 ? 'collapse' : ''}`}>
                    {loading ? (
                      <p>Cargando datos...</p>
                    ) : (
                      <table ref={tableRef} className="table table-bordered table-hover datatable full-width nowrap">
                        <thead>
                          <tr>
                            <th>Día</th>
                            <th>Mes</th>
                            <th>Descripción</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feriados.map((feriado) => (
                            <tr key={feriado.id}>
                              <td>{feriado.dia}</td>
                              <td>{feriado.mes}</td>
                              <td>{feriado.descripcion}</td>
                              <td>
                                <Link className="icon-block" to="#" onClick={() => handleDelete(feriado.id)}>
                                  <i className="fa fa-fw fa-times"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`card-body ${isCollapsed2 ? 'collapse' : ''}`}>
                    <div className="card-header">
                      <h3 className="card-title">Agregar Feriado</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group col-md-6">
                        <label>Día</label>
                        <input
                          type="number"
                          min={1} max={31}
                          autoFocus
                          className="form-control"
                          id="dia"
                          placeholder="Día"
                          required
                          value={data.dia}
                          onChange={(e) => setData({ ...data, dia: e.target.value })}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Mes</label>
                        <input
                          type="number"
                          min={1} max={12}
                          className="form-control"
                          id="mes"
                          placeholder="Mes"
                          required
                          value={data.mes}
                          onChange={(e) => setData({ ...data, mes: e.target.value })}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Descripción</label>
                        <input
                          type="text"
                          className="form-control"
                          id="descripcion"
                          placeholder="Descripción"
                          required
                          value={data.descripcion}
                          onChange={(e) => setData({ ...data, descripcion: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn btn-info">
                        Guardar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className={`card-footer ${isCollapsed2 ? 'collapse' : ''}`}></div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VerEmpresa;
