import { useState, useEffect, useRef } from "react";
import { ContentHeader } from "@components";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticatedApi } from "./interfaces/api";
import { Servicio } from "./interfaces/servicio";
import { Relacion_Servicio_Plan } from "./interfaces/relacion_servicio_plan";
import { toast } from 'react-toastify';
import { Plan } from "./interfaces/plan";
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';
import moment from 'moment';

const VerServicio = () => {
  const [data, setData] = useState({
    servicio: "",
    plan: "",
    precio: "",
  });

  const [dataServicio, setDataServicio] = useState<Servicio | null>(null);
  const { id } = useParams();
  const ServicioId = Number(id);

  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `/servicio/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setDataServicio(response.data);
      })
  }, [id]);

  const handleEliminar = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (confirmacion) {
      const api = authenticatedApi();
      api.delete(`/servicio/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // La eliminación fue exitosa
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              navigate("/servicio");
            }, 3000);
          } else {
            // Ocurrió un error en la eliminación
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el servicio ya tiene precios, elimine primero los precios.");
        });
    }
  };

  const handleEliminarPrecio =  (id : number) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar?");
    if (confirmacion) {
      const api = authenticatedApi();
      api.delete(`/relacion_servicio_plan/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // La eliminación fue exitosa
            setDeleted(true);
            toast.success("Eliminado con éxito!");
            setTimeout(() => {
              fetchRelacion_Servicio_Plan();
            }, 3000);
          } else {
            // Ocurrió un error en la eliminación
            toast.error("Error al eliminar");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          toast.error("Error: el precio ya tiene registros.");
        });
    }
  };

  const [isCollapsed1, setIsCollapsed1] = useState(false);
  const [isCollapsed2, setIsCollapsed2] = useState(false);
  // Función para alternar el colapso
  const toggleCollapse1 = () => {
    setIsCollapsed1(!isCollapsed1);
  };
  const toggleCollapse2 = () => {
    setIsCollapsed2(!isCollapsed2);
  };

  const [Relacion_Servicio_Plans, setRelacion_Servicio_Plan] = useState<Relacion_Servicio_Plan[]>([]);
  const [loading, setLoading] = useState(true); // Variable de estado para indicar si los datos se están cargando
  const tableRef = useRef(null);
  // Función para consultar la API y actualizar el estado
  const fetchRelacion_Servicio_Plan = () => {
    const url = `/relacion_servicio_plan/${id}`;
    authenticatedApi()
      .get(url)
      .then((response) => {
        setRelacion_Servicio_Plan(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      });
  };
  // Asegúrate de llamar a fetchFeriados también en tu useEffect
  useEffect(() => {
    fetchRelacion_Servicio_Plan();
  }, []);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const updatedData = {
      ...data,
      servicio: ServicioId,
      plan: data.plan, 
      precio: e.target.precio.value.replace(/\./g, ''),
    };
    const api = authenticatedApi();
    api
      .post("/relacion_servicio_plan", updatedData)
      .then((res) => {
        console.log(res);
        toast.success("Guardado con éxito!");
        setTimeout(() => {
          console.log(res);
          toast.success("Guardado con éxito!");
          // Llama aquí a la función que consulta la API
          fetchRelacion_Servicio_Plan();
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error: no se puede volver a cargar un mismo plan");
      });
  };
  const [ListaPlan, setListaPlan] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<{ value: number; label: string } | null>(null);
  useEffect(() => {
    const api = authenticatedApi();
    api.get('/plan')
      .then((response) => {
        setListaPlan(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los responsables:', error);
        toast.error('Error al cargar los responsables');
      });
  }, []);
  const handleSelectChange = (selectedOption:any) => {
    setSelectedPlan(selectedOption);
    // Asegúrate de enviar solo el valor al estado 'data', no el objeto completo
    setData({ ...data, plan: selectedOption.value });
  };
  
  return (
    <div>
      <ContentHeader title="Detalles del Servicio" />
      <section className="content">
        <div className="container-fluid">
          {dataServicio && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">Datos del Servicio</h3>
                <button
                  className="btn btn-tool"
                  onClick={toggleCollapse1}
                >
                  {isCollapsed1 ? (
                    <i className="fas fa-plus"></i>
                  ) : (
                    <i className="fas fa-minus"></i>
                  )}
                </button>

                <div className="card-tools">
                  <Link
                    className="btn bg-maroon"
                    to="#"
                    onClick={handleEliminar}
                  >
                    Eliminar Servicio
                  </Link>
                  <Link
                    className="btn bg-teal"
                    to={`/servicio/editar/${dataServicio.id}`}
                  >
                    Editar Servicio
                  </Link>
                  <Link to={`/servicio`} className="btn btn-info">
                    Volver a la Lista
                  </Link>
                </div>
              </div>
              <div className={`card-body ${isCollapsed1 ? 'collapse' : ''}`}>
                <div className="row">
                  <div className="col-md-12">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Descripción:</strong> {dataServicio.descripcion}</p>
                    <p><strong>Cantidad de Especialidades:</strong> {dataServicio.cantidad_especialidad}</p>
                    <p><strong>Número de veces por semana:</strong> {dataServicio.veces_semana}</p>
                  </div>
                </div>
              </div>
              <div className="card-header">
                <h3 className="card-title">Lista de Precios</h3>
                <button
                  className="btn btn-tool"
                  onClick={toggleCollapse2}
                >
                  {isCollapsed2 ? (
                    <i className="fas fa-plus"></i>
                  ) : (
                    <i className="fas fa-minus"></i>
                  )}
                </button>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className={`card-body ${isCollapsed2 ? 'collapse' : ''}`}>
                    {loading ? ( // Mostrar un mensaje si los datos se están cargando
                      <p>Cargando datos...</p>
                    ) : ( // Mostrar la tabla si los datos no se están cargando
                      <table
                        ref={tableRef}
                        className="table table-bordered table-hover datatable full-width nowrap"
                      >
                        <thead>
                          <tr>
                            <th>Plan</th>
                            <th>Precio</th>
                            <th>Fecha de Actualización</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Relacion_Servicio_Plans.map((Relacion_Servicio_Plan) => (
                            <tr key={Relacion_Servicio_Plan.id}>
                              <td>{Relacion_Servicio_Plan.descripcion_plan}</td>
                              <td>{Relacion_Servicio_Plan.precio.toLocaleString('es-ES')}</td>
                              <td>
                                {moment(Relacion_Servicio_Plan.fecha_actualizacion).format('DD/MM/YYYY')}
                              </td>
                              <td>
                                <Link
                                  className="icon-block"
                                  to="#"
                                  onClick={() => handleEliminarPrecio(Relacion_Servicio_Plan.id)}
                                >
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
                      <h3 className="card-title">Asignar Precio</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                    <div className="form-group col-md-6">
                        <label>Asignar Plan</label>
                        <Select
                          id="plan"
                          options={ListaPlan.map(plan => ({
                            value: plan.id,
                            label: `${plan.descripcion} - ${plan.observacion}`
                          }))}
                          value={selectedPlan}
                          onChange={handleSelectChange}
                          placeholder="Buscar plan..."
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>Precio (Gs)</label>
                        <NumericFormat
                          type="text"
                          autoFocus
                          className="form-control"
                          id="precio"
                          placeholder="Precio"
                          required
                          value={data.precio}
                          onValueChange={(values) => {
                            const { formattedValue, value } = values;
                            // Aquí puedes hacer lo que necesites con el valor
                            setData({ ...data, precio: value });
                          }}
                          thousandSeparator='.'
                          decimalSeparator=","
                          decimalScale={0} // Esto limitará la entrada a números enteros
                          allowNegative={false} // Esto evitará números negativos
                        />
                      </div>
                      <button type="submit" className="btn btn-info">
                        Guardar
                      </button>
                    </form>
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

export default VerServicio;
