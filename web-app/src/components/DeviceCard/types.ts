interface IDeviceCardProps {
  title: string;
  description: string;
  date: string;
  className?: string;
  textClass?: string;
  iconClass?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default IDeviceCardProps;
