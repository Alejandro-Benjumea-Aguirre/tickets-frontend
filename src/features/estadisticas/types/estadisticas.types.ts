export type Entity    = 'agentes' | 'clientes';
export type Period    = 'mes' | 'trimestre' | 'semestre' | 'anual';
export type ChartType = 'barras' | 'lineal' | 'torta';

export interface DataSets {
  abiertos:   number[];
  cerrados:   number[];
  pendientes: number[];
  enEspera:   number[];
}