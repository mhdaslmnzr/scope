// frontend/types.ts

export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (row: T) => React.ReactNode;
}
