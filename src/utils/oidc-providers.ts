import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { sleep } from './helpers';
import { authenticatedApi } from "../pages/interfaces/api";

declare const FB: any;

const GOOGLE_CONFIG: UserManagerSettings = {
  authority: 'https://accounts.google.com',
  client_id: '',
  client_secret: '',
  redirect_uri: `${window.location.protocol}//${window.location.host}/callback`,
  scope: 'openid email profile',
  loadUserInfo: true,
};

export const GoogleProvider = new UserManager(GOOGLE_CONFIG);

/*
export const authLogin = (email: string, password: string) => {
  return new Promise(async (res, rej) => {
    await sleep(500);
    //if (email === 'admin@example.com' && password === 'admin') {
    if (email == email) {
      localStorage.setItem(
        'authentication',
        JSON.stringify({ profile: { email: 'admin@fonoelke.com' } })
      );
      return res({ profile: { email: 'admin@fonoelke.com' } });
    }
    return rej({ message: 'Credentials are wrong!' });
  });
};
*/
export const authLogin = async (usuario: string, password: string): Promise<any> => {
  try {
    const response = await authenticatedApi().post("/usuario/login", {
      usuario,
      password,
    });

    if (response.status === 200) {
      const data = response.data;
      const profile = {
        id: data.id,
        perfil: data.perfil,
        email: data.nombre_completo,
        foto: data.foto,
      };

      localStorage.setItem('authentication', JSON.stringify({ profile }));

      return { profile };
    } else {
      throw new Error('Las credenciales son incorrectas!');
    }
  } catch (error: any) {
    console.error("Error en la autenticación:", error);
    throw new Error(`Error en la autenticación: ${(error as Error).message}`);
  }
};


export const getAuthStatus = () => {
  return new Promise(async (res, rej) => {
    await sleep(500);
    try {
      let authentication = localStorage.getItem('authentication');
      if (authentication) {
        authentication = JSON.parse(authentication);
        return res(authentication);
      }
      return res(undefined);
    } catch (error) {
      return res(undefined);
    }
  });
};
