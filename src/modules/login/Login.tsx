import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '@store/reducers/auth';
import { setWindowClass } from '@app/utils/helpers';
import * as Yup from 'yup';

import { authLogin } from '@app/utils/oidc-providers';
import { Form, InputGroup } from 'react-bootstrap';
import { Button } from '@app/styles/common';

const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t] = useTranslation();

  const login = async (usuario: string, password: string) => {
    try {
      setAuthLoading(true);
      const response = await authLogin(usuario, password);
      dispatch(setAuthentication(response as any));
      toast.success('Login is succeed!');
      setAuthLoading(false);
      // dispatch(loginUser(token));
      navigate('/');
      navigate(0); // Esto forzará una actualización de la página
    } catch (error: any) {
      setAuthLoading(false);
      toast.error(error.message || 'Failed');
    }
  };
  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      usuario: '',
      password: '',
    },
    validationSchema: Yup.object({
      usuario: Yup.string().required('Required'),  
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      login(values.usuario, values.password);
    },
  });

  setWindowClass('hold-transition login-page');
  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
        <img src="logo.png" alt="Logo" className="img-fluid" width="300"/>
        <span className="brand-text font-weight-bolder">
          <span style={{ color: '#2874A6' }}>ISOPAR</span>
          <span style={{ color: '#1ABC9C' }}> S.R.L</span>
        </span>        </div>
        <div className="card-body">
          <p className="login-box-msg">{t('Ingrese su usuario y contraseña para iniciar sesión')}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="usuario"
                  name="usuario"
                  type="text"
                  autoFocus 
                  placeholder="Usuario"
                  onChange={handleChange}
                  value={values.usuario}
                  isValid={touched.usuario && !errors.usuario}
                  isInvalid={touched.usuario && !!errors.usuario}
                  onKeyDown={(event: any) => {
                    if (event.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                {touched.usuario && errors.usuario ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.usuario}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-user" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                  onKeyDown={(event: any) => {
                    if (event.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="row">
              <div className="col-4">
              </div>
            </div>
          <div className="social-auth-links text-center mt-2 mb-3">
            <Button 
                  loading={isAuthLoading}
                  onClick={handleSubmit as any}
            >
              Ingresar
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
