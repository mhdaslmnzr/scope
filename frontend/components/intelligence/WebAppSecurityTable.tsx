// frontend/components/intelligence/WebAppSecurityTable.tsx
import DataTable from '../ui/DataTable';
import Badge from '../ui/Badge';
import { ColumnDef } from '../../types';

type AppSecurityIssue = {
  id: number;
  app: string;
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  lastTested: string;
};

const mockData: AppSecurityIssue[] = [
  { id: 1, app: 'Portal', issue: 'XSS', severity: 'High', lastTested: '2024-06-10' },
  { id: 2, app: 'API', issue: 'Broken Auth', severity: 'Medium', lastTested: '2024-06-09' },
  { id: 3, app: 'Admin', issue: 'CSRF', severity: 'Low', lastTested: '2024-06-08' },
];

const columns: ColumnDef<AppSecurityIssue>[] = [
  {
    accessorKey: 'app',
    header: 'App',
  },
  {
    accessorKey: 'issue',
    header: 'Issue',
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: (row) => {
      const severity = row.severity;
      const tone = severity === 'High' ? 'red' : severity === 'Medium' ? 'orange' : 'yellow';
      return <Badge tone={tone}>{severity}</Badge>;
    },
  },
  {
    accessorKey: 'lastTested',
    header: 'Last Tested',
  },
];

export default function WebAppSecurityTable() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Web/App Security</h1>
      </div>
      <DataTable data={mockData} columns={columns} filterKeys={['app', 'issue']} />
    </div>
  );
} 