'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import DataTable from './ui/DataTable'
import { ColumnDef } from '../types'
import { vendors, criticalityColors, scoreColors } from '../mock-data'

export default function VendorsTable({ 
  onSelect, 
  vendors: propVendors, 
  searchQuery 
}: { 
  onSelect: (vendor: any) => void;
  vendors?: any[];
  searchQuery?: string;
}) {

  const [search, setSearch] = useState(searchQuery || '');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const vendorsToUse = propVendors || vendors;
  
  const vendorsWithTags = vendorsToUse.map(v => ({
    ...v,
    tags: v.tags || (v.criticality === 'Critical' ? ['Critical', 'Watchlist'] : v.criticality === 'High' ? ['High'] : v.criticality === 'Medium' ? ['Medium'] : ['Low'])
  }));

  const filteredVendors = vendorsWithTags.filter(v =>
    (!search || v.name.toLowerCase().includes(search.toLowerCase())) &&
    (!criticalityFilter || v.criticality === criticalityFilter) &&
    (!sectorFilter || v.sector === sectorFilter) &&
    (!countryFilter || v.country === countryFilter)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendors = filteredVendors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectionChange = (selected: any[]) => { setSelectedVendors(selected); };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Vendor Name',
      cell: (row: any) => (
        <a onClick={(e) => { e.stopPropagation(); onSelect(row); }} className="hover:underline cursor-pointer font-medium text-gray-900">
          {row.name}
        </a>
      ),
    },
    {
      accessorKey: 'criticality',
      header: 'Criticality',
      cell: (row: any) => <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${criticalityColors[row.criticality]}`}>{row.criticality}</span>,
    },
    {
      accessorKey: 'score',
      header: 'Risk Score',
      cell: (row: any) => <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${scoreColors(row.score)}`}>{row.score}</span>,
    },
    { accessorKey: 'sector', header: 'Sector' },
    { accessorKey: 'country', header: 'Country' },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: (row: any) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-0">
      {/* Search Results Indicator */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Search results for "{searchQuery}"
              </span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {filteredVendors.length} vendors found
              </span>
            </div>
            <button
              onClick={() => setSearch('')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          <span>Vendors</span>
        </h1>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={criticalityFilter} onChange={e => setCriticalityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Criticality</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Sectors</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Technology">Technology</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Energy">Energy</option>
            <option value="Transportation">Transportation</option>
            <option value="Cloud">Cloud</option>
            <option value="Pharma">Pharma</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Other">Other</option>
          </select>
          <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Countries</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Singapore">Singapore</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <DataTable data={currentVendors} columns={columns} filterKeys={['name', 'sector', 'country']} onSelectionChange={handleSelectionChange} />
      
      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Showing {startIndex + 1} to {Math.min(endIndex, filteredVendors.length)} of {filteredVendors.length} vendors</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Items per page selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            
            {/* Page navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}