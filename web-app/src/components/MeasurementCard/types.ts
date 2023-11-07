interface IMeasurementCardProps {
  currentVolume: number;
  spentVolume: number;
  previousSpentVolume?: number;
  percentage: number;
  createdAt: string;
  className?: string;
  textClass?: string;
  iconClass?: string;
}

export default IMeasurementCardProps;
