export interface Option {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: Option[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
}