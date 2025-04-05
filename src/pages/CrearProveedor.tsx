import { useState, FormEvent } from "react";
import { authenticatedApi } from "./interfaces/api";
import { ContentHeader } from "@components";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Departamentos from "./interfaces/departamentos";
import Ciudades from "./interfaces/ciudades";
type Departamento = keyof typeof Ciudades;
type Ciudad = typeof Ciudades[Departamento][number];

const CrearProveedor = () => {
    const [data, setData] = useState({
        razon_social: "",
        nombre_fantasia: "",
        tipo_documento: "",
        numero_documento: "",
        pais: 'Paraguay',
        departamento: 'CENTRAL',
        ciudad: 'LUQUE',
        barrio: '',
        direccion: '',
        telefono: '',
        nombre_contacto: '',
        estado: 'Activo',
        email: "",
    });

    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const api = authenticatedApi();
        api.post("/proveedor", data)
            .then((res) => {
                Swal.fire({
                    title: 'Guardado con éxito!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                });
                setTimeout(() => {
                    navigate(`/configuracion/proveedor/${res.data.id}`);
                }, 2000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.error || 'Error al guardar el registro';
                Swal.fire({
                    title: 'Error al guardar el registro',
                    text: errorMsg,
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            });
    };

    return (
        <div>
            <ContentHeader title="Agregar Proveedor" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info card-outline">
                        <div className="card-header">
                            <h3 className="card-title">Ingresar Información del Proveedor</h3>
                            <div className="card-tools">
                                <Link to="/configuracion/proveedor" className="btn btn-info">
                                    Volver a la Lista
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                        <form onSubmit={handleSubmit} className="row">
                                <div className="form-group col-md-6">
                                    <label>Razón Social* </label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="razon_social"
                                        placeholder="Razón Social"
                                        required
                                        value={data.razon_social}
                                        onChange={(e) => setData({ ...data, razon_social: e.target.value })}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Nombre de fantasía*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_fantasia"
                                        placeholder="Nombre de fantasia"
                                        required
                                        value={data.nombre_fantasia}
                                        onChange={(e) =>
                                            setData({ ...data, nombre_fantasia: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Tipo de Documento*</label>
                                    <select
                                        className="form-control"
                                        id="tipo_documento"
                                        value={data.tipo_documento}
                                        onChange={(e) =>
                                            setData({ ...data, tipo_documento: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="RUC">RUC</option>
                                        <option value="Cédula de Identidad">Cédula de Identidad</option>
                                    </select>
                                </div>


                                <div className="form-group col-md-6">
                                    <label>Numero de Documento*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="numero_documento"
                                        placeholder="Numero de Documento"
                                        required
                                        value={data.numero_documento}
                                        onChange={(e) =>
                                            setData({ ...data, numero_documento: e.target.value })
                                        }
                                    />
                                </div>


                                <div className="form-group col-md-6">
                                    <label>País*</label>
                                    <select
                                        className="form-control"
                                        id="pais"
                                        required
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


                                <div className="form-group col-md-6">
                                    <label>Departamento*</label>
                                    <select
                                        className="form-control"
                                        id="departamento"
                                        required
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


                                <div className="form-group col-md-6">
                                    <label>Ciudad*</label>
                                    <select
                                        className="form-control"
                                        id="ciudad"
                                        required
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


                                <div className="form-group col-md-6">
                                    <label>Barrio*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="barrio"
                                        placeholder="Barrio"
                                        required
                                        value={data.barrio}
                                        onChange={(e) =>
                                            setData({ ...data, barrio: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Dirección*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="direccion"
                                        placeholder="Dirección"
                                        required
                                        value={data.direccion}
                                        onChange={(e) =>
                                            setData({ ...data, direccion: e.target.value })
                                        }
                                    />
                                </div>


                                <div className="form-group col-md-6">
                                    <label>Teléfono* </label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="telefono"
                                        placeholder="Teléfono"
                                        required
                                        value={data.telefono}
                                        onChange={(e) => setData({ ...data, telefono: e.target.value })}
                                    />
                                </div>



                                <div className="form-group col-md-6">
                                    <label>Correo Electrónico* </label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="email"
                                        placeholder="Correo Electrónico"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                    />
                                </div>


                                <div className="form-group col-md-6">
                                    <label> Nombre de Contacto* </label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="form-control"
                                        id="nombre_contacto"
                                        placeholder="Contacto"
                                        required
                                        value={data.nombre_contacto}
                                        onChange={(e) => setData({ ...data, nombre_contacto: e.target.value })}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Estado*</label>
                                    <select
                                        className="form-control"
                                        id="estado"
                                        required
                                        value={data.estado}
                                        onChange={(e) => setData({ ...data, estado: e.target.value })}
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
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

export default CrearProveedor;
