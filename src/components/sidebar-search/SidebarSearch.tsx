import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SidebarSearch = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e:any) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
      navigate(`/paciente/buscar/${encodeURIComponent(searchText.trim())}`);
      navigate(0); // Esto forzará una actualización de la página
      setSearchText(''); // Reiniciar el estado de searchText después de la búsqueda
    }
  };
  

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="input-group">
        <input
          className="form-control form-control-sidebar"
          type="text"
          placeholder="Buscar Cliente"
          autoFocus
          aria-label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="input-group-append">
          <button type="submit" className="btn btn-sidebar">
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </form>
  );
};
