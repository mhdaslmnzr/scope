// frontend/components/intelligence/VulnerabilitiesTable.tsx
import DataTable from '../ui/DataTable';
import { ColumnDef } from '../../types';

type Vulnerability = {
  cve: string;
  vendor: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  date: string;
};
const MOCK_VULNS: Vulnerability[] = [
  { cve: 'CVE-2024-1234', vendor: 'Acme Corp', severity: 'Critical', status: 'Open', date: '2024-06-10' },
  { cve: 'CVE-2024-2345', vendor: 'CyberSafe', severity: 'High', status: 'In Progress', date: '2024-06-09' },
  { cve: 'CVE-2023-9999', vendor: 'D Pharma', severity: 'Medium', status: 'Closed', date: '2024-06-08' },
  { cve: 'CVE-2022-8888', vendor: 'DataVault', severity: 'Low', status: 'Open', date: '2024-06-07' },
  { cve: 'CVE-2024-5678', vendor: 'Acme Corp', severity: 'High', status: 'Open', date: '2024-06-06' },
];

const columns: ColumnDef<Vulnerability>[] = [
  {
    accessorKey: 'cve',
    header: 'CVE',
    cell: (row) => <span className="font-mono text-blue-700 font-semibold">{row.cve}</span>,
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: (row) => {
      const severity = row.severity;
      const color =
        severity === 'Critical' ? 'text-red-700' :
        severity === 'High' ? 'text-orange-700' :
        severity === 'Medium' ? 'text-yellow-700' :
        'text-green-700';
      return <span className={`font-semibold ${color}`}>{severity}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'date',
    header: 'Date Found',
  },
];

export default function VulnerabilitiesTable() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl font-bold text-blue-700">Vulnerabilities</span>
      </div>
      <DataTable data={MOCK_VULNS} columns={columns} filterKeys={['cve', 'vendor']} />
    </div>
  );
} 