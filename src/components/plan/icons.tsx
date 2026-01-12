import { MapPin, Utensils, Camera } from 'lucide-react';

export const TrainIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M7 15v4" />
    <path d="M17 15v4" />
  </svg>
);

export const TentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 21L14 3l10.5 18H3.5z" />
    <path d="M14 21V11" />
  </svg>
);

export const getIconForItem = (index: number) => {
  const icons = [
    <TrainIcon key="train" />,
    <MapPin key="mappin" size={16} />,
    <Utensils key="utensils" size={16} />,
    <Camera key="camera" size={16} />,
    <TentIcon key="tent" />
  ];
  return icons[index % icons.length];
};
