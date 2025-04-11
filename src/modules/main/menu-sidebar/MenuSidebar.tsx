import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuItem } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
import { SidebarSearch } from '@app/components/sidebar-search/SidebarSearch';
import i18n from '@app/utils/i18n';

export interface IMenuItem {
  name: string;
  icon?: string;
  path?: string;
  children?: Array<IMenuItem>;
}

export const MENU: IMenuItem[] = [
  {
    name: i18n.t('Producción'),
    icon: 'fas fa-industry nav-icon', // Ícono de producción
    children: [
      { name: i18n.t('Insumos'), icon: 'fas fa-boxes nav-icon', path: '/produccion/insumos' },
      { name: i18n.t('Operaciones'), icon: 'fas fa-cogs nav-icon', path: '/produccion/operaciones' },
      { name: i18n.t('Productos'), icon: 'fas fa-cube nav-icon', path: '/produccion/productos' }
    ]
  },
  {
    name: i18n.t('Configuración'),
    icon: 'fas fa-cog nav-icon', // Ícono de configuración
    children: [
      { name: i18n.t('Empresa'), icon: 'fas fa-building nav-icon', path: '/configuracion/empresa/1' },
      { name: i18n.t('Departamento'), icon: 'fas fa-sitemap nav-icon', path: '/configuracion/departamento' },
      { name: i18n.t('Usuario'), icon: 'fas fa-users nav-icon', path: '/configuracion/usuario' },
      { name: i18n.t('Perfil Usuario'), icon: 'fas fa-user-circle nav-icon', path: '/configuracion/perfil' },
      { name: i18n.t('Proveedores'), icon: 'fas fa-truck nav-icon', path: '/configuracion/proveedor' }
    ]
  },
  {
    name: i18n.t('Recursos Humanos'),
    icon: 'fas fa-user-tie nav-icon', // Ícono de recursos humanos
    children: [
      { name: i18n.t('Pedido Compras'), icon: 'fas fa-shopping-cart nav-icon', path: '/recursos-humanos/pedido-compras' },
      { name: i18n.t('Artículos'), icon: 'fas fa-clipboard-list nav-icon', path: '/recursos-humanos/articulos' },
      { name: i18n.t('Proveedores'), icon: 'fas fa-handshake nav-icon', path: '/recursos-humanos/proveedores' }
    ]
  },
  {
    name: i18n.t('Informes'),
    icon: 'fas fa-chart-bar nav-icon', // Ícono de informes
    children: [
      { name: i18n.t('Producción'), icon: 'fas fa-chart-pie nav-icon', path: '/informes/produccion' },
      { name: i18n.t('Recursos Humanos'), icon: 'fas fa-file-alt nav-icon', path: '/informes/recursos-humanos' }
    ]
  },
  {
    name: i18n.t('Ayuda'),  
    icon: 'fas fa-question-circle nav-icon', // Ícono de ayuda
    path: '/Ayuda',  
  },
];

const StyledBrandImage = styled(Image)`
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;

const StyledUserImage = styled(Image)`
  --pf-box-shadow: 0 3px 6px #00000029, 0 3px 6px #0000003b !important;
`;

const MenuSidebar = () => {
  const authentication = useSelector((state: any) => state.auth.authentication);
  const sidebarSkin = useSelector((state: any) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state: any) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state: any) => state.ui.menuChildIndent);

  let filteredMenu = MENU;

  if (authentication.profile.perfil === 3) {
    // Filtrar menú para usuario con perfil 1
    filteredMenu = MENU.filter(item => item.path === '/' || item.path === '/paciente' || item.path === '/agenda' || item.path === '/Ayuda');
  }

  return (
    <aside className={`main-sidebar elevation-4 ${sidebarSkin}`}>
      <Link to="/" className="brand-link">
        <StyledBrandImage
          src="/logo.png"
          alt="Fabrica"
          width={29}
          height={37.4}
        />
        <span className="brand-text font-weight-bolder">
        <span style={{ color: '#2874A6' }}>FABRICA</span>
        <span style={{ color: '#1ABC9C' }}> S.A.</span>
        </span>
      </Link>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <StyledUserImage
              src={authentication.profile.foto}
              fallbackSrc="/img/default-profile.png"
              alt="User"
              width={34}
              height={34}
              rounded
            />
          </div>
          <div className="info">
            <Link to={`/perfilusuario`} className="d-block">
              {authentication.profile.email}
            </Link>
          </div>
        </div>

        <div className="form-inline">
          <SidebarSearch />
        </div>

        <nav className="mt-2" style={{ overflowY: 'hidden' }}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${menuItemFlat ? ' nav-flat' : ''
              }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
          >
            {filteredMenu.map((menuItem: IMenuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
export default MenuSidebar;