export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
}

// Tipo para la información detallada de stock que devolverá el servicio
export interface DetailedStockItem {
  color_id: number;
  color_name: string;
  talla_id: number;
  talla_name: string;
  cantidad: number;
}

// Tipo para la estructura transformada que usará el StockDialog
export interface FormattedStockData {
  colorName: string;
  stockBySize: { [tallaName: string]: number }; // { 'S': 10, 'M': 5 }
}

// Tipo para la estructura completa del StockDialog (tallas + datos por color)
export interface StockViewData {
  sizes: string[]; // ['S', 'M', 'L']
  stockByColor: FormattedStockData[];
}
