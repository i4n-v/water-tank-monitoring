interface IPaginatorProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default IPaginatorProps;
