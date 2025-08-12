// frontend/components/ui/DataTable.tsx
import { useState, useMemo } from 'react';
import { ColumnDef } from '../../types';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Skeleton from './Skeleton';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filterKeys?: (keyof T)[];
  onSelectionChange?: (selected: T[]) => void;
  isLoading?: boolean;
  skeletonRows?: number;
}

export default function DataTable<T>({ data, columns, filterKeys = [], onSelectionChange, isLoading = false, skeletonRows = 5 }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [dense, setDense] = useState(false);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (sortConfig) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      if (!globalFilter) return true;
      return filterKeys.some(key => {
        const value = item[key];
        return typeof value === 'string' && value.toLowerCase().includes(globalFilter.toLowerCase());
      });
    });
  }, [sortedData, globalFilter, filterKeys]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelectedRows = new Set(filteredData.map((_, index) => index));
      setSelectedRows(newSelectedRows);
      onSelectionChange?.(filteredData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) newSelectedRows.delete(index);
    else newSelectedRows.add(index);
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(Array.from(newSelectedRows).map(i => filteredData[i]));
  };

  const isAllSelected = selectedRows.size === filteredData.length && filteredData.length > 0;
  const cellPadding = dense ? 'px-4 py-2' : 'px-6 py-4';
  const headPadding = dense ? 'px-4 py-2' : 'px-6 py-3';

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        />
        <button
          onClick={() => setDense(d => !d)}
          className="whitespace-nowrap px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          {dense ? 'Comfortable' : 'Compact'}
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {onSelectionChange && (
                <th className={headPadding}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.accessorKey as string}
                  onClick={() => handleSort(col.accessorKey)}
                  className={`${headPadding} text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer`}
                >
                  <div className="flex items-center">
                    {col.header}
                    {sortConfig?.key === col.accessorKey && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {onSelectionChange && (
                    <td className={cellPadding}><Skeleton className="h-4 w-4 rounded" /></td>
                  )}
                  {columns.map((col) => (
                    <td key={`${String(col.accessorKey)}-${i}`} className={`${cellPadding}`}>
                      <Skeleton className="h-4 w-32" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${rowIndex % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50`}>
                  {onSelectionChange && (
                    <td className={cellPadding}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleSelectRow(rowIndex)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.accessorKey as string} className={`${cellPadding} whitespace-nowrap`}>
                      {col.cell ? col.cell(row) : (row[col.accessorKey] as any)}
                    </td>
                  ))}
                </tr>
              ))
            )}
            {!isLoading && filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="text-center text-gray-400 py-8">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}