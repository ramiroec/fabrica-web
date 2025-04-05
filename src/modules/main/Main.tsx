import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarMenu } from '@app/store/reducers/ui';
import ControlSidebar from '@app/modules/main/control-sidebar/ControlSidebar';
import Header from '@app/modules/main/header/Header';
import MenuSidebar from '@app/modules/main/menu-sidebar/MenuSidebar';
import Footer from '@app/modules/main/footer/Footer';
import { Image } from '@profabric/react-components';

const Main = () => {
  const dispatch = useDispatch();
  const menuSidebarCollapsed = useSelector(
    (state: any) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state: any) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const authentication = useSelector((state: any) => state.auth.authentication);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  useEffect(() => {
    setIsAppLoaded(Boolean(authentication));
  }, [authentication]);

  useEffect(() => {
    // Simplify sidebar management
    if (menuSidebarCollapsed) {
      document.body.classList.add('sidebar-collapse');
      document.body.classList.remove('sidebar-open', 'sidebar-closed');
    } else {
      document.body.classList.add('sidebar-open');
      document.body.classList.remove('sidebar-collapse', 'sidebar-closed');
    }

    return () => {
      document.body.classList.remove('sidebar-collapse', 'sidebar-open', 'sidebar-closed');
    };
  }, [menuSidebarCollapsed]);

  useEffect(() => {
    // Simplify control sidebar management
    if (controlSidebarCollapsed) {
      document.body.classList.remove('control-sidebar-slide-open');
    } else {
      document.body.classList.add('control-sidebar-slide-open');
    }

    return () => {
      document.body.classList.remove('control-sidebar-slide-open');
    };
  }, [controlSidebarCollapsed]);

  const getAppTemplate = useCallback(() => {
    if (!isAppLoaded) {
      return (
        <div className="preloader flex-column justify-content-center align-items-center">
          <Image
            className="animation__shake"
            src="/img/logo.png"
            alt="AdminLTELogo"
            height={60}
            width={60}
          />
        </div>
      );
    }
    return (
      <>
        <Header />

        <MenuSidebar />

        <div className="content-wrapper">
          <div className="pt-3" />
          <section className="content">
            <Outlet />
          </section>
        </div>
        <Footer />
        <ControlSidebar />
        <div
          id="sidebar-overlay"
          role="presentation"
          onClick={handleToggleMenuSidebar}
        />
      </>
    );
  }, [isAppLoaded]);

  return <div className="wrapper">{getAppTemplate()}</div>;
};

export default Main;
