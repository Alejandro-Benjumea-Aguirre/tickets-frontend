import { User } from "./users";

export interface Option {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: Option[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
}

export interface NavbarProps {
  user: User | null;
  logoutUser: () => void;
}

export interface TableProps {
  titles: [],
  body: []
}