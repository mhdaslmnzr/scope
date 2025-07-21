// frontend/components/intelligence/AttackSurfaceTable.tsx
import DataTable from '../ui/DataTable';
import { ColumnDef } from '../../types';

type Asset = {
  id: number;
  asset: string;
  type: string;
  risk: 'High' | 'Medium' | 'Low';
  lastSeen: string;
};
const mockData: Asset[] = [
  { id: 1, asset: 'acme.com', type: 'Domain', risk: 'High', lastSeen: '2024-06-10' },
  { id: 2, asset: 'vpn.acme.com', type: 'VPN', risk: 'Medium', lastSeen: '2024-06-09' },
  { id: 3, asset: 'mail.acme.com', type: 'Mail Server', risk: 'Low', lastSeen: '2024-06-08' },
];

const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: 'asset',
    header: 'Asset',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'risk',
    header: 'Risk',
    cell: (row) => {
      const risk = row.risk;
      const color =
        risk === 'High' ? 'text-red-700' :
        risk === 'Medium' ? 'text-orange-700' :
        'text-yellow-700';
      return <span className={`font-semibold ${color}`}>{risk}</span>;
    },
  },
  {
    accessorKey: 'lastSeen',
    header: 'Last Seen',
  },
];

export default function AttackSurfaceTable() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attack Surface</h1>
      </div>
      <DataTable data={mockData} columns={columns} filterKeys={['asset', 'type']} />
    </div>
  );
} 