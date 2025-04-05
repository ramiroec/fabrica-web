import React, { useState, useEffect } from "react";
import { authenticatedApi } from "./interfaces/api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Usuario } from "./interfaces/usuario";
import { Especialidad } from "./interfaces/especialidad";
import moment from "moment";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "../pdf/MyDocument";
import { Paciente } from "./interfaces/paciente";
import { RecomendacionDiagnostico } from "./interfaces/recomendacion_diagnostico";
import MyConstanciaDocument from "../pdf/MyConstanciaDocument";
import { Responsable } from "../pages/interfaces/responsable";

// Catálogo de items que se muestran en el select
interface ItemPlanInicial {
  id: number;
  item_descripcion: string;
}

// Estructura de los registros de la tabla plan_intervencion_inicial
interface PlanIntervencion {
  id: number;
  descripcion_plan: string;
  terapeuta: number;
  fecha: Date;
  paciente: number;
}

const AtencionProfesional = ({ isClearfix = false }: { isClearfix?: boolean }) => {
  const authentication = useSelector((state: any) => state.auth.authentication);
  const { id } = useParams(); // ID del paciente
  const navigate = useNavigate();

  // Estado general de datos a enviar
  const [data, setData] = useState({
    descripcion: "",
    observacion: "",
    terapeuta: authentication?.profile?.id || 0,
    estado: "Activo",
    fecha: new Date().toISOString().substr(0, 10),
    notas: "",
    buscarItem: "",
    especialidad: "",
    cantidad_sesiones: "",
    cantidad_veces_semana: "",
    tiempo_meses: "",
    paciente: id,
    descripcion_plan: "",
    tipo_medicacion: "",
    descripcion_medi: "",
    dosis: "",
    doctor: "",
    fecha_desde: "",
    observacion_medi: "",
  });

  // Datos de un paciente
  const [patientData, setPatientData] = useState<Paciente | null>(null);

  // Datos de su responsable
  const [responsableData, setResponsableData] = useState<Responsable | null>(
    null
  );

  // Notas
  const [notasResponsable, setNotasResponsable] = useState<
    {
      id: number;
      fecha: string;
      nota: string;
      terapeuta: number;
      nombre_completo_terapeuta: string;
    }[]
  >([]);

  // Medicación
  const [medicacion, setMedicacion] = useState<
    {
      id: number;
      tipo_medicacion: string;
      descripcion_medi: string;
      dosis: string;
      doctor: string;
      fecha_desde: string;
      observacion_medi: string;
      paciente: number;
    }[]
  >([]);

  // Recomendaciones
  const [recomendaciones, setRecomendaciones] = useState<
    {
      id: number;
      especialidad: string;
      cantidad_sesiones: number;
      cantidad_veces_semana: number;
      tiempo_meses: number;
    }[]
  >([]);

  // Tabla de Especialidades
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

  // Lista de usuarios (para mostrar terapeuta, etc.)
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Items del plan de intervención (ya agregados para el paciente)
  const [planIntervencion, setPlanIntervencion] = useState<PlanIntervencion[]>(
    []
  );

  // Catálogo de ítems (ListarItemPlanInicial) para elegir en el select
  const [itemPlanCatalog, setItemPlanCatalog] = useState<ItemPlanInicial[]>([]);

  // Controla el item seleccionado en el <select>
  const [selectedItemId, setSelectedItemId] = useState("");

  // Paneles colapsables
  const [isCollapsedDatosPaciente, setIsCollapsedDatosPaciente] =
    useState(false);
  const [isCollapsedNotas, setIsCollapsedNotas] = useState(false);
  const [isCollapsedRecomendaciones, setIsCollapsedRecomendaciones] =
    useState(true);
  const [isCollapsedPlanIntervencion, setIsCollapsedPlanIntervencion] =
    useState(true);
  const [isCollapsedMedicacion, setIsCollapsedMedicacion] = useState(true);

  // ---- Effects ----

  // 1. Carga datos del paciente y otras listas al inicio
  useEffect(() => {
    fetchDatosPaciente();
    fetchCatalogoItems();
    fetchTodo();
  }, [id]);

  // 2. Carga adicional responsable al inicio
  useEffect(() => {
    fetchResponsable();
  }, [id]);

  // ---- Llamadas a la API ----

  const fetchDatosPaciente = async () => {
    try {
      const response = await authenticatedApi().get(`/paciente/${id}`);
      setPatientData(response.data);
    } catch (error) {
      console.error("Error al obtener datos del paciente:", error);
    }
  };

  // Carga el catálogo /item_plan_inicial
  const fetchCatalogoItems = async () => {
    try {
      const response = await authenticatedApi().get("/item_plan_inicial");
      setItemPlanCatalog(response.data);
    } catch (error) {
      console.error("Error al obtener items del plan inicial:", error);
    }
  };

  // Carga todo lo demás
  const fetchTodo = async () => {
    try {
      // Usuarios
      authenticatedApi()
        .get("/usuario")
        .then((resp) => {
          setUsuarios(resp.data);
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
        });

      // Notas
      authenticatedApi()
        .get(`/atencion_notas/paciente/${id}`)
        .then((resp) => {
          setNotasResponsable(resp.data);
        })
        .catch((error) => {
          console.error("Error al obtener notas:", error);
          toast.error("Error al cargar notas");
        });

      // Recomendaciones
      authenticatedApi()
        .get(`/recomendacion_diagnostico/paciente/${id}`)
        .then((resp) => {
          setRecomendaciones(resp.data);
        })
        .catch((error) => {
          console.error("Error al obtener recomendaciones:", error);
          toast.error("Error al cargar recomendaciones");
        });

      // Medicación
      authenticatedApi()
        .get(`/medicacion/paciente/${id}`)
        .then((resp) => {
          setMedicacion(resp.data);
        })
        .catch((error) => {
          console.error("Error al obtener medicación:", error);
          toast.error("Error al cargar medicaciones");
        });

      // Plan de Intervención (ya agregado al paciente)
      authenticatedApi()
        .get(`/plan_intervencion_inicial/paciente/${id}`)
        .then((resp) => {
          setPlanIntervencion(resp.data);
        })
        .catch((error) => {
          console.error("Error al obtener planes de intervención:", error);
        });

      // Especialidades
      authenticatedApi()
        .get("/especialidad")
        .then((resp) => {
          setEspecialidades(resp.data);
        })
        .catch((error) => {
          console.error("Error al obtener especialidades:", error);
        });
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  // Responsable
  const fetchResponsable = async () => {
    try {
      const response = await authenticatedApi().get(
        `/relacion_paciente_responsable/notificacion/${id}`
      );
      setResponsableData(response.data);
    } catch (error) {
      console.error("Error al obtener datos del responsable:", error);
      toast.success("Cargado todo con exito");
    }
  };

  // ---- Manejo de formularios ----

  // Handler genérico para inputs
  const handleInputChange = (e: any) => {
    const { id, value, type, checked, files } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Cálculo automático de "tiempo_meses" si tenemos sesiones y veces por semana
  const handleInputChangeTiempo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    if (id === "cantidad_sesiones" || id === "cantidad_veces_semana") {
      calcularTiempoMeses(value, id);
    }
  };

  const calcularTiempoMeses = (valor: string, id: string) => {
    const cantidad_sesiones =
      id === "cantidad_sesiones"
        ? parseFloat(valor)
        : parseFloat(data.cantidad_sesiones);
    const cantidad_veces_semana =
      id === "cantidad_veces_semana"
        ? parseFloat(valor)
        : parseFloat(data.cantidad_veces_semana);

    if (
      !isNaN(cantidad_sesiones) &&
      !isNaN(cantidad_veces_semana) &&
      cantidad_veces_semana > 0
    ) {
      const semanasTotales = cantidad_veces_semana * 4;
      const meses = cantidad_sesiones / semanasTotales;
      setData((prevData) => ({
        ...prevData,
        tiempo_meses: meses.toFixed(2),
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        tiempo_meses: "",
      }));
    }
  };

  // ---- Recomendaciones ----

  const especialidadCambio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const especialidadId = e.target.value;
    setData({ ...data, especialidad: especialidadId });
  };

  const handleSubmitRecomendacion = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaRecomendacion = {
      especialidad: data.especialidad,
      cantidad_sesiones: parseFloat(data.cantidad_sesiones),
      cantidad_veces_semana: parseFloat(data.cantidad_veces_semana),
      tiempo_meses: parseFloat(data.tiempo_meses),
      paciente: id,
    };

    authenticatedApi()
      .post(`/recomendacion_diagnostico`, nuevaRecomendacion)
      .then(() => {
        toast.success("Recomendación agregada con éxito");
        fetchTodo();
        setData({
          ...data,
          especialidad: "",
          cantidad_sesiones: "",
          cantidad_veces_semana: "",
          tiempo_meses: "",
        });
      })
      .catch(() => {
        toast.error("Error al agregar la Recomendación");
      });
  };

  const eliminarRecomendacion = (recomendacionId: number) => {
    authenticatedApi()
      .delete(`/recomendacion_diagnostico/${recomendacionId}`)
      .then(() => {
        toast.success("Recomendación eliminada con éxito");
        fetchTodo();
      })
      .catch((error) => {
        console.error("Error al eliminar recomendación:", error);
        toast.error("Error al eliminar recomendación");
      });
  };

  // ---- Medicación ----

  const handleSubmitMedicacion = (e: React.FormEvent) => {
    e.preventDefault();
    const medicacionItem = {
      tipo_medicacion: data.tipo_medicacion,
      descripcion_medi: data.descripcion_medi,
      dosis: data.dosis,
      doctor: data.doctor,
      fecha_desde: data.fecha_desde,
      observacion_medi: data.observacion_medi,
      paciente: id,
    };

    authenticatedApi()
      .post(`/medicacion`, medicacionItem)
      .then(() => {
        toast.success("Medicación agregada con éxito");
        fetchTodo();
        setData({
          ...data,
          tipo_medicacion: "",
          descripcion_medi: "",
          dosis: "",
          doctor: "",
          fecha_desde: "",
          observacion_medi: "",
        });
      })
      .catch(() => {
        toast.error("Error al agregar Medicación");
      });
  };

  const eliminarMedicacion = (medicacionId: number) => {
    authenticatedApi()
      .delete(`/medicacion/${medicacionId}`)
      .then(() => {
        toast.success("Medicación eliminada con éxito");
        fetchTodo();
      })
      .catch((error) => {
        console.error("Error al eliminar medicación:", error);
        toast.error("Error al eliminar medicación");
      });
  };

  // ---- Plan de Intervención ----

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    // Buscamos el ítem en el catálogo por su ID
    const selected = itemPlanCatalog.find(
      (itm) => itm.id === parseInt(selectedItemId, 10)
    );
    const nuevoItem = {
      descripcion_plan: selected ? selected.item_descripcion : "",
      terapeuta: data.terapeuta,
      fecha: data.fecha,
      paciente: id,
    };

    authenticatedApi()
      .post(`/plan_intervencion_inicial`, nuevoItem)
      .then((resp) => {
        toast.success("Item agregado con éxito");
        fetchTodo();
        setSelectedItemId("");
      })
      .catch(() => {
        toast.error("Error al agregar Item");
      });
  };

  const eliminarItem = (itemId: number) => {
    authenticatedApi()
      .delete(`/plan_intervencion_inicial/${itemId}`)
      .then(() => {
        toast.success("Item eliminado con éxito");
        fetchTodo();
      })
      .catch((error) => {
        console.error("Error al eliminar item:", error);
        toast.error("Error al eliminar item");
      });
  };

  // ---- Notas Internas ----
  const handleSubmitNota = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaNota = {
      fecha: data.fecha,
      nota: data.notas,
      terapeuta: data.terapeuta,
      paciente: id,
    };

    authenticatedApi()
      .post(`/atencion_notas`, nuevaNota)
      .then((response) => {
        toast.success("Nota agregada con éxito");
        // Recargar las notas
        setData({
          ...data,
          fecha: new Date().toISOString().substr(0, 10),
          notas: "",
        });
        fetchTodo();
      })
      .catch(() => {
        toast.error("Error al agregar la nota");
      });
  };

  const eliminarNotaResponsable = (notaId: number) => {
    authenticatedApi()
      .delete(`/atencion_notas/${notaId}`)
      .then(() => {
        toast.success("Nota eliminada con éxito");
        fetchTodo();
      })
      .catch((error) => {
        console.error("Error al eliminar nota:", error);
        toast.error("Error al eliminar nota");
      });
  };

  // ---- Toggle colapsables ----
  const toggleCollapseDatosPaciente = () =>
    setIsCollapsedDatosPaciente(!isCollapsedDatosPaciente);
  const toggleCollapseNotas = () => setIsCollapsedNotas(!isCollapsedNotas);
  const toggleCollapseRecomendaciones = () =>
    setIsCollapsedRecomendaciones(!isCollapsedRecomendaciones);
  const toggleCollapsePlanIntervencion = () =>
    setIsCollapsedPlanIntervencion(!isCollapsedPlanIntervencion);
  const toggleCollapseMedicacion = () =>
    setIsCollapsedMedicacion(!isCollapsedMedicacion);

  // ---- Render ----
  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <h3 className="card-title">Atención Profesional</h3>
              <button
                className="btn btn-tool"
                onClick={toggleCollapseDatosPaciente}
              >
                {isCollapsedDatosPaciente ? (
                  <i className="fas fa-plus"></i>
                ) : (
                  <i className="fas fa-minus"></i>
                )}
              </button>
            </div>
            {/* Datos Paciente */}
            <div
              className={`card-body ${
                isCollapsedDatosPaciente ? "collapse" : ""
              }`}
            >
              <div className="row">
                <div className="form-group col-md-4">
                  <div
                    className="anamnesis-item"
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      Anamnesis General
                    </span>
                    <div className="text-right">
                      <Link
                        className="btn btn-info"
                        to={`/anamnesis/general/editar/${id}`}
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div
                    className="anamnesis-item"
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      Anamnesis Estimulación Temprana
                    </span>
                    <div className="text-right">
                      <Link
                        className="btn btn-info"
                        to={`/anamnesis/estimulacion/editar/${id}`}
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <div
                    className="anamnesis-item"
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      Anamnesis Fonoaudiología
                    </span>
                    <div className="text-right">
                      <Link
                        className="btn btn-info"
                        to={`/anamnesis/fonoaudiologia/editar/${id}`}
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-4">
                  <div
                    className="anamnesis-item"
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      Anamnesis Psicología Educacional
                    </span>
                    <div className="text-right">
                      <Link
                        className="btn btn-info"
                        to={`/anamnesis/psicologia_educacional/editar/${id}`}
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <div
                    className="anamnesis-item"
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>
                      Anamnesis Psicológica Clínica
                    </span>
                    <div className="text-right">
                      <Link
                        className="btn btn-info"
                        to={`/anamnesis/psicologia_clinica/editar/${id}`}
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Fin Datos Paciente */}
          </div>

          {/* Medicación */}
          <div className="card">
            <div
              className="card-header"
              onClick={toggleCollapseMedicacion}
              style={{ cursor: "pointer" }}
            >
              <h3 className="card-title">Medicación</h3>
              <button className="btn btn-tool">
                {isCollapsedMedicacion ? (
                  <i className="fas fa-plus"></i>
                ) : (
                  <i className="fas fa-minus"></i>
                )}
              </button>
            </div>
            <div
              className={`card-body ${isCollapsedMedicacion ? "collapse" : ""}`}
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>Tipo de Medicación</label>
                      <textarea
                        className="form-control"
                        id="tipo_medicacion"
                        placeholder="Tipo de Medicación"
                        required
                        value={data.tipo_medicacion}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Descripción</label>
                      <textarea
                        className="form-control"
                        id="descripcion_medi"
                        placeholder="Descripción"
                        required
                        value={data.descripcion_medi}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>Dosis</label>
                      <textarea
                        className="form-control"
                        id="dosis"
                        placeholder="Dosis"
                        required
                        value={data.dosis}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Doctor</label>
                      <textarea
                        className="form-control"
                        id="doctor"
                        placeholder="Doctor"
                        required
                        value={data.doctor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <label style={{ marginLeft: "10px", marginRight: "5px" }}>
                      Fecha
                    </label>
                    <textarea
                      className="form-control"
                      id="fecha_desde"
                      placeholder="¿Desde cuándo?"
                      required
                      value={data.fecha_desde}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={{ marginLeft: "10px", marginRight: "5px" }}>
                      Observación
                    </label>
                    <textarea
                      className="form-control"
                      id="observacion_medi"
                      placeholder="Observación"
                      required
                      value={data.observacion_medi}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSubmitMedicacion}
                  >
                    Agregar Medicación
                  </button>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h4>Medicaciones Agregadas</h4>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Tipo de Medicación</th>
                        <th>Descripción</th>
                        <th>Dosis</th>
                        <th>Doctor</th>
                        <th>Fecha</th>
                        <th>Observación</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicacion.map((medi) => (
                        <tr key={medi.id}>
                          <td>{medi.tipo_medicacion}</td>
                          <td>{medi.descripcion_medi}</td>
                          <td>{medi.dosis}</td>
                          <td>{medi.doctor}</td>
                          <td>{medi.fecha_desde}</td>
                          <td
                            style={{
                              maxWidth: "300px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {medi.observacion_medi}
                          </td>
                          <td>
                            <button
                              className="icon-block btn btn-link"
                              onClick={() => eliminarMedicacion(medi.id)}
                            >
                              <i className="fa fa-fw fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Plan de Intervención inicial - Consultas externas */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Plan de Intervención inicial - Consultas externas
              </h3>
              <button
                className="btn btn-tool"
                onClick={toggleCollapsePlanIntervencion}
              >
                {isCollapsedPlanIntervencion ? (
                  <i className="fas fa-plus"></i>
                ) : (
                  <i className="fas fa-minus"></i>
                )}
              </button>
            </div>
            <div
              className={`card-body ${
                isCollapsedPlanIntervencion ? "collapse" : ""
              }`}
            >
              <div className="row">
                <div className="form-group col-md-12">
                  <label>Descripción Item</label>
                  {/* Select normal, sin búsqueda */}
                  <select
                    className="form-control"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    <option value="">Seleccione un item</option>
                    {itemPlanCatalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.item_descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <button
                      className="btn btn-primary mt-2"
                      onClick={handleSubmitItem}
                    >
                      Agregar Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h4>Items Agregados</h4>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Descripción Item</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planIntervencion.map((items) => (
                          <tr key={items.id}>
                            <td>
                              {items.fecha
                                ? moment(items.fecha).format("DD/MM/YYYY")
                                : ""}
                            </td>
                            <td>{items.descripcion_plan}</td>
                            <td>
                              <button
                                className="icon-block btn btn-link"
                                onClick={() => eliminarItem(items.id)}
                              >
                                <i className="fa fa-fw fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan de Intervención inicial - Consulta en el Centro FonoElke */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Plan de Intervención inicial - Consulta en el Centro FonoElke
              </h3>
              <button
                className="btn btn-tool"
                onClick={toggleCollapseRecomendaciones}
              >
                {isCollapsedRecomendaciones ? (
                  <i className="fas fa-plus"></i>
                ) : (
                  <i className="fas fa-minus"></i>
                )}
              </button>
            </div>
            <div
              className={`card-body ${
                isCollapsedRecomendaciones ? "collapse" : ""
              }`}
            >
              <div className="row">
                <div className="form-group col-md-3 mb-4">
                  <label>Especialidad</label>
                  <select
                    className="form-control"
                    id="especialidad"
                    value={data.especialidad}
                    onChange={especialidadCambio}
                  >
                    <option value="">Seleccione una especialidad</option>
                    {especialidades.map((esp) => (
                      <option key={esp.id} value={esp.id}>
                        {esp.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-3 mb-4">
                  <label>Cantidad Sesiones</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad_sesiones"
                    placeholder="Cantidad Sesiones"
                    value={data.cantidad_sesiones}
                    onChange={handleInputChangeTiempo}
                  />
                </div>
                <div className="form-group col-md-3 mb-4">
                  <label>Cantidad Veces por Semana</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad_veces_semana"
                    placeholder="Cantidad Veces por Semana"
                    value={data.cantidad_veces_semana}
                    onChange={handleInputChangeTiempo}
                  />
                </div>
                <div className="form-group col-md-3 mb-4">
                  <label>Tiempo (Meses)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="tiempo_meses"
                    placeholder="Tiempo en Meses"
                    value={data.tiempo_meses}
                    readOnly
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSubmitRecomendacion}
                  >
                    Agregar Recomendación
                  </button>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h4>Recomendaciones Agregadas</h4>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Especialidad</th>
                          <th>Cantidad Sesiones</th>
                          <th>Cantidad Veces por Semana</th>
                          <th>Tiempo (Meses)</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recomendaciones.map((rec) => (
                          <tr key={rec.id}>
                            <td>
                              {
                                // Busca la descripción en la tabla especialidad
                                especialidades.find(
                                  (e) =>
                                    e.id === parseInt(rec.especialidad, 10)
                                )?.descripcion || rec.especialidad
                              }
                            </td>
                            <td>{rec.cantidad_sesiones}</td>
                            <td>{rec.cantidad_veces_semana}</td>
                            <td>{rec.tiempo_meses}</td>
                            <td>
                              <button
                                className="icon-block btn btn-link"
                                onClick={() => eliminarRecomendacion(rec.id)}
                              >
                                <i className="fa fa-fw fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reporte */}
          <div className="card">
            <div className="card-header" style={{ backgroundColor: "#d1eef3" }}>
              <h3 className="card-title">Reporte</h3>
            </div>
            <div className="card-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ flexGrow: 1, marginRight: "1rem" }}>
                  Plan de Intervención Inicial
                </span>
                <PDFDownloadLink
                  document={
                    <MyDocument
                      patientData={
                        patientData || {
                          id: 0,
                          fecha_registro: new Date(),
                          nombre: "Nombre por defecto",
                          apellido: "Apellido por defecto",
                          tipo_documento: "",
                          numero_documento: "",
                          fecha_nacimiento: new Date(),
                          escuela: "",
                          grado: "",
                          turno: "",
                          edad: 0,
                          pais: "",
                          departamento: "",
                          ciudad: "",
                          barrio: "",
                          direccion: "",
                          tipo_contacto: "",
                          observacion_contacto: "",
                          responsable: "",
                          celular: "",
                          foto: "",
                          interventionPlan: [],
                          recommendations: [],
                        }
                      }
                      itemPlan={recomendaciones || []}
                    />
                  }
                  fileName="Informe_Plan_Intervencion_Inicial.pdf"
                  style={{
                    backgroundColor: "#00b3e6",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "0.5rem 1rem",
                    textDecoration: "none",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {({ loading }) =>
                    loading ? "Generando PDF..." : "Generar PDF"
                  }
                </PDFDownloadLink>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ flexGrow: 1, marginRight: "1rem" }}>
                  Constancia
                </span>
                <PDFDownloadLink
                  document={
                    <MyConstanciaDocument
                      patientData={
                        patientData || {
                          id: 0,
                          fecha_registro: new Date(),
                          nombre: "Nombre por defecto",
                          apellido: "Apellido por defecto",
                          tipo_documento: "",
                          numero_documento: "",
                          fecha_nacimiento: new Date(),
                          escuela: "",
                          grado: "",
                          turno: "",
                          edad: 0,
                          pais: "",
                          departamento: "",
                          ciudad: "",
                          barrio: "",
                          direccion: "",
                          tipo_contacto: "",
                          observacion_contacto: "",
                          responsable: "",
                          celular: "",
                          interventionPlan: [],
                          recommendations: [],
                        }
                      }
                      responsableData={
                        responsableData || {
                          id: 0,
                          nombre: "Nombre por defecto",
                          apellido: "Apellido por defecto",
                          tipo_documento: "",
                          numero_documento: 0,
                          fecha_nacimiento: new Date(),
                          ocupacion: "",
                          celular: "",
                          notificacion: "",
                          email: "",
                          pais: "",
                          departamento: "",
                          ciudad: "",
                          barrio: "",
                          direccion: "",
                          tipo_relacion: "",
                        }
                      }
                      itemPlan={recomendaciones || []}
                    />
                  }
                  fileName="Informe_Constancia.pdf"
                  style={{
                    backgroundColor: "#00b3e6",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "0.5rem 1rem",
                    textDecoration: "none",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {({ loading }) => (loading ? "Generando PDF..." : "Generar PDF")}
                </PDFDownloadLink>
              </div>
            </div>
          </div>

          {/* Notas Internas */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Notas Internas</h3>
              <button className="btn btn-tool" onClick={toggleCollapseNotas}>
                {isCollapsedNotas ? (
                  <i className="fas fa-plus"></i>
                ) : (
                  <i className="fas fa-minus"></i>
                )}
              </button>
            </div>
            <div className={`card-body ${isCollapsedNotas ? "collapse" : ""}`}>
              <div className="row">
                <div className="form-group col-md-2">
                  <label>Fecha</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fecha"
                    value={data.fecha}
                    disabled
                  />
                </div>
                <div className="form-group col-md-3">
                  <label>Terapeuta</label>
                  <select
                    className="form-control"
                    id="terapeuta"
                    value={data.terapeuta}
                    disabled
                  >
                    <option value="">Seleccione un terapeuta</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre} {usuario.apellido}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label>Notas</label>
                  <textarea
                    className="form-control"
                    id="notas"
                    placeholder="Escribe tus notas aquí..."
                    required
                    value={data.notas}
                    onChange={handleInputChange}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSubmitNota}
                  >
                    Agregar Nota
                  </button>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-12">
                  <h4>Notas Agregadas</h4>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Terapeuta</th>
                          <th>Nota</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notasResponsable.map((nota) => (
                          <tr key={nota.id}>
                            <td>{moment(nota.fecha).format("DD/MM/YYYY")}</td>
                            <td>{nota.nombre_completo_terapeuta}</td>
                            <td
                              style={{
                                maxWidth: "300px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {nota.nota}
                            </td>
                            <td>
                              <button
                                className="icon-block btn btn-link"
                                onClick={() => eliminarNotaResponsable(nota.id)}
                              >
                                <i className="fa fa-fw fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Fin Notas Internas */}
        </div>
      </section>
    </div>
  );
};

export default AtencionProfesional;
