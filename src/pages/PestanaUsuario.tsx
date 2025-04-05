import VerUsuario from './VerUsuario';

const ActivityTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <VerUsuario isClearfix={false} />
    </div>
  );
};

export default ActivityTab;
