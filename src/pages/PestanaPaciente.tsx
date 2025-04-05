const ActivityTab = ({isActive}: {isActive: boolean}) => {
  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
    </div>
  );
};

export default ActivityTab;
