import React, { useState, useEffect } from "react";
import { ContentHeader } from "@components";
import { authenticatedApi } from "./interfaces/api";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Departamentos from "./interfaces/departamentos";
import Ciudades from "./interfaces/ciudades";
type Departamento = keyof typeof Ciudades;
type Ciudad = typeof Ciudades[Departamento][number];

const EditarResponsable = () => {
  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    notificacion: "",
    tipo_documento: "",
    fecha_nacimiento: "",
    ocupacion: "",
    numero_documento: "",
    celular: "",
    email: "",
    pais: "",
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
  });


  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
      authenticatedApi()
          .get(`/responsable/${id}`)
          .then((res) => {
              setData(res.data);
          });
  }, [id]);


  const handleSubmit = (e: any) => {
    e.preventDefault();
    const updatedData = {
      ...data,
      nombre: e.target.nombre.value,
      apellido: e.target.apellido.value,
      notificacion: e.target.notificacion.value,
      tipo_documento: e.target.tipo_documento.value,
      ocupacion: e.target.ocupacion.value,
      numero_documento: e.target.numero_documento.value,
      celular: e.target.celular.value,
      email: e.target.email.value,
      pais: e.target.pais.value,
      departamento: e.target.departamento.value,
      ciudad: e.target.ciudad.value,
      barrio: e.target.barrio.value,
      direccion: e.target.direccion.value,

    };

    const api = authenticatedApi();
    api.put(`/responsable/${id}`, updatedData)
      .then((res) => {
        console.log(res);
        toast.success("Guardado con éxito!");
        setTimeout(() => {
          navigate("/responsable");
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error al guardar el registro, verifique los datos: numero de cedula no puede ser repetido.");
      });
  };
  return (
    <div>
      <ContentHeader title="Editar Responsable" />
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info card-outline">
            <div className="card-header">
              <h3 className="card-title">Ingresar Información</h3>
              <div className="card-tools">
                <Link to="/responsable" className="btn btn-info">
                  Volver a la Lista
                </Link>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Nombre</label>
                    <input
                      type="text"
                      autoFocus
                      className="form-control"
                      id="nombre"
                      placeholder="Nombre"
                      required
                      value={data.nombre}
                      onChange={(e) => setData({ ...data, nombre: e.target.value })}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      placeholder="Apellido"
                      required
                      value={data.apellido}
                      onChange={(e) => setData({ ...data, apellido: e.target.value })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-4">
                    <label>Fecha de nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_nacimiento"
                      placeholder="Número de Documento"
                    
                      value={data.fecha_nacimiento}
                      onChange={(e) =>
                        setData({ ...data, fecha_nacimiento: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Ocupación</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ocupacion"
                      placeholder="Ocupación"
                     
                      value={data.ocupacion}
                      onChange={(e) => setData({ ...data, ocupacion: e.target.value })}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Notificación</label>
                    <select
                      className="form-control"
                      id="notificacion"
                      value={data.notificacion}
                      onChange={(e) => setData({ ...data, notificacion: e.target.value })}
                    >
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Tipo de Documento</label>
                    <select
                      className="form-control"
                      id="tipo_documento"
                      value={data.tipo_documento}
                      onChange={(e) => setData({ ...data, tipo_documento: e.target.value })}
                    >
                      <option value="Cédula">Cédula</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Número de Documento</label>
                    <input
                      type="text"
                      className="form-control"
                      id="numero_documento"
                      placeholder="Documento"
                     
                      value={data.numero_documento}
                      onChange={(e) => setData({ ...data, numero_documento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Celular</label>
                    <input
                      type="text"
                      className="form-control"
                      id="celular"
                      placeholder="Celular"
                      required
                      value={data.celular}
                      onChange={(e) => setData({ ...data, celular: e.target.value })}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                     
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>País</label>
                    <select
                      className="form-control"
                      id="pais"
                      value={data.pais}
                      onChange={(e) => setData({ ...data, pais: e.target.value })}
                    >
                      <option value="Alemania">Alemania</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Australia">Australia</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Brasil">Brasil</option>
                      <option value="Canadá">Canadá</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Corea del Sur">Corea del Sur</option>
                      <option value="España">España</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Francia">Francia</option>
                      <option value="India">India</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Italia">Italia</option>
                      <option value="Japón">Japón</option>
                      <option value="México">México</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Perú">Perú</option>
                      <option value="Polonia">Polonia</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Reino Unido">Reino Unido</option>
                      <option value="Rusia">Rusia</option>
                      <option value="Sudáfrica">Sudáfrica</option>
                      <option value="Suiza">Suiza</option>
                      <option value="Turquía">Turquía</option>
                      <option value="Ucrania">Ucrania</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                    </select>
                  </div>

                  <div className="form-group col-md-4">
                    <label>Departamento </label>
                    <select
                      className="form-control"
                      id="departamento"
                      value={data.departamento}
                      onChange={(e) => {
                        const selectedDepartamento = e.target
                          .value as Departamento;
                        const defaultCiudad =
                          selectedDepartamento in Ciudades
                            ? Ciudades[
                            selectedDepartamento as Departamento
                            ][0]
                            : "";
                        setData({
                          ...data,
                          departamento: selectedDepartamento,
                          ciudad: defaultCiudad,
                        });
                      }}
                    >
                      <option value="">
                        Seleccionar el Departamento
                      </option>
                      {Departamentos.map((departamento) => (
                        <option key={departamento} value={departamento}>
                          {departamento}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-4">
                    <label>Ciudad </label>
                    <select
                      className="form-control"
                      id="ciudad"
                      value={data.ciudad || ""}
                      onChange={(e) =>
                        setData({ ...data, ciudad: e.target.value })
                      }
                    >
                      <option value="">Seleccionar la Ciudad</option>
                      {data.departamento in Ciudades
                        ? Ciudades[
                          data.departamento as Departamento
                        ].map((ciudad: Ciudad) => (
                          <option key={ciudad} value={ciudad}>
                            {ciudad}
                          </option>
                        ))
                        : null}
                    </select>
                  </div>
                  <div className="form-group col-md-4">
                    <label>Barrio</label>
                    <input
                      type="text"
                      className="form-control"
                      id="barrio"
                      placeholder="Barrio"
                    
                      value={data.barrio}
                      onChange={(e) =>
                        setData({ ...data, barrio: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group col-md-8">
                    <label>Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      placeholder="Dirección"
                   
                      value={data.direccion}
                      onChange={(e) =>
                        setData({ ...data, direccion: e.target.value })
                      }
                    />
                  </div>
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
export default EditarResponsable;