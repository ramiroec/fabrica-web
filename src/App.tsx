import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from '@modules/main/Main';
import Login from '@modules/login/Login';
import Register from '@modules/register/Register';
import ForgetPassword from '@modules/forgot-password/ForgotPassword';
import RecoverPassword from '@modules/recover-password/RecoverPassword';
import { useWindowSize } from '@app/hooks/useWindowSize';
import { calculateWindowSize } from '@app/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { setWindowSize } from '@app/store/reducers/ui';

import Dashboard from '@pages/Dashboard';
import Blank from '@pages/Blank';
import SubMenu from '@pages/SubMenu';
import Profile from '@pages/profile/Profile';


// Importaciones relacionadas con Perfiles
import ListarPerfil from '@pages/ListarPerfil';
import VerPerfil from '@pages/VerPerfil';
import CrearPerfil from '@pages/CrearPerfil';
import EditarPerfil from '@pages/EditarPerfil';

// Importaciones relacionadas con Departamentos
import ListarDepartamento from '@pages/ListarDepartamento';
import VerDepartamento from '@pages/VerDepartamento';
import CrearDepartamento from '@pages/CrearDepartamento';
import EditarDepartamento from '@pages/EditarDepartamento';

// Importaciones relacionadas con Empresas
import EditarEmpresa from '@pages/EditarEmpresa';
import VerEmpresa from '@pages/VerEmpresa';

// Importaciones relacionadas con Usuarios
import CrearUsuario from '@pages/CrearUsuario';
import EditarUsuario from '@pages/EditarUsuario';
import ListarUsuario from '@pages/ListarUsuario';
import VerUsuario from '@pages/Usuario';
import PerfilUsuario from '@pages/PerfilUsuario';

//Importaciones relacionadas a proveedores
import ListarProveedor from './pages/ListarProveedor';
import CrearProveedor from './pages/CrearProveedor';
import VerProveedor from './pages/VerProveedor';
import EditarProveedor from './pages/EditarProveedor';

import ProcesoProduccion from './pages/ProcesoProduccion';
// Importaciones adicionales

import Ayuda from '@pages/Ayuda';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { setAuthentication } from './store/reducers/auth';
import {
  getAuthStatus,
} from './utils/oidc-providers';


const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState(true);

  const checkSession = async () => {
    try {
      let responses: any = await Promise.all([
        getAuthStatus(),
      ]);

      responses = responses.filter((r: any) => Boolean(r));

      if (responses && responses.length > 0) {
        dispatch(setAuthentication(responses[0]));
      }
    } catch (error: any) {
      console.log('error', error);
    }
    setIsAppLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  if (isAppLoading) {
    return <p>Loading</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/register" element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Route>
        <Route path="/recover-password" element={<PublicRoute />}>
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Ayuda" element={<Ayuda />} />
            <Route path="/ProcesoProduccion" element={<ProcesoProduccion />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/configuracion/empresa/:id" element={<VerEmpresa />} />
            <Route path="/configuracion/empresa/editar/:id" element={<EditarEmpresa />} />
            <Route path="/perfilusuario" element={<PerfilUsuario />} />
            <Route path="/configuracion/perfil" element={<ListarPerfil />} />
            <Route path="/configuracion/perfil/:id" element={<VerPerfil />} />
            <Route path="/configuracion/perfil/crear" element={<CrearPerfil />} />
            <Route path="/configuracion/perfil/editar/:id" element={<EditarPerfil />} />
            <Route path="/configuracion/departamento" element={<ListarDepartamento />} />
            <Route path="/configuracion/departamento/:id" element={<VerDepartamento />} />
            <Route path="/configuracion/departamento/crear" element={<CrearDepartamento />} />
            <Route path="/configuracion/departamento/editar/:id" element={<EditarDepartamento />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sub-menu-1" element={<SubMenu />} />
            <Route path="/sub-menu-2" element={<Blank />} />
            <Route path="/configuracion/usuario" element={<ListarUsuario />} />
            <Route path="/configuracion/usuario/:id" element={<VerUsuario />} />
            <Route path="/configuracion/usuario/crear" element={<CrearUsuario />} />
            <Route path="/configuracion/usuario/editar/:id" element={<EditarUsuario />} />
            <Route path="/configuracion/proveedor" element={<ListarProveedor />} />
            <Route path="/configuracion/proveedor/editar/:id" element={<EditarProveedor />} />
            <Route path="/configuracion/proveedor/crear" element={<CrearProveedor />} />
            <Route path="/configuracion/proveedor/:id" element={<VerProveedor />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;
