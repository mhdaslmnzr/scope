// frontend/components/intelligence/VulnerabilitiesTable.tsx
import DataTable from '../ui/DataTable';
import Badge from '../ui/Badge';
import { ColumnDef } from '../../types';
import { vendors } from '../../mock-data';

type Vulnerability = {
  cve: string;
  vendor: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  date: string;
};

// Generate dynamic vulnerability data based on actual vendor scores
const generateVulnerabilities = (): Vulnerability[] => {
  const vulns: Vulnerability[] = [];
  vendors.forEach(vendor => {
    const vulnScore = vendor.scoreDetails.find(s => s.category === 'Vulnerability Management')?.score || 50;
    
    // Generate more vulns for vendors with lower vulnerability management scores
    const vulnCount = vulnScore < 40 ? 3 : vulnScore < 60 ? 2 : 1;
    
    for (let i = 0; i < vulnCount; i++) {
      const severity = vulnScore < 30 ? 'Critical' : 
                     vulnScore < 50 ? 'High' : 
                     vulnScore < 70 ? 'Medium' : 'Low';
      
      const status = vulnScore < 40 ? 'Open' : 
                    vulnScore < 70 ? 'In Progress' : 'Closed';
      
      vulns.push({
        cve: `CVE-2024-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        vendor: vendor.name,
        severity: severity as any,
        status: status as any,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  });
  return vulns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const VULNERABILITIES = generateVulnerabilities();

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
      const tone = severity === 'Critical' ? 'red' : severity === 'High' ? 'orange' : severity === 'Medium' ? 'yellow' : 'green';
      return <Badge tone={tone as any}>{severity}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (row) => {
      const status = row.status;
      const tone = status === 'Open' ? 'red' : status === 'In Progress' ? 'yellow' : 'green';
      return <Badge tone={tone as any}>{status}</Badge>;
    },
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