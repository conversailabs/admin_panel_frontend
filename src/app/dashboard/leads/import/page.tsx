'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';

interface ImportRow {
  [key: string]: string;
}

interface MappingConfig {
  [csvColumn: string]: string;
}

export default function LeadImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<ImportRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<MappingConfig>({});
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // Standard lead fields that can be mapped
  const leadFields = [
    { value: '', label: 'Skip this column' },
    { value: 'name', label: 'Name *' },
    { value: 'email', label: 'Email' },
    { value: 'phone_number', label: 'Phone Number' },
    { value: 'company', label: 'Company' },
    { value: 'title', label: 'Job Title' },
    { value: 'industry', label: 'Industry' },
    { value: 'location', label: 'Location' },
    { value: 'lead_source', label: 'Lead Source' },
    { value: 'tags', label: 'Tags (comma-separated)' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) return;
      
      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      setCsvHeaders(headers);
      
      // Parse data rows
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: ImportRow = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setCsvData(data.slice(0, 100)); // Limit preview to 100 rows
      
      // Auto-map common fields
      const autoMapping: MappingConfig = {};
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('name') && !lowerHeader.includes('company')) {
          autoMapping[header] = 'name';
        } else if (lowerHeader.includes('email')) {
          autoMapping[header] = 'email';
        } else if (lowerHeader.includes('phone')) {
          autoMapping[header] = 'phone_number';
        } else if (lowerHeader.includes('company')) {
          autoMapping[header] = 'company';
        } else if (lowerHeader.includes('title') || lowerHeader.includes('position')) {
          autoMapping[header] = 'title';
        } else if (lowerHeader.includes('industry')) {
          autoMapping[header] = 'industry';
        } else if (lowerHeader.includes('location') || lowerHeader.includes('city')) {
          autoMapping[header] = 'location';
        } else if (lowerHeader.includes('source')) {
          autoMapping[header] = 'lead_source';
        }
      });
      
      setMapping(autoMapping);
      setActiveTab('mapping');
    };
    reader.readAsText(file);
  };

  const updateMapping = (csvColumn: string, leadField: string) => {
    setMapping(prev => ({
      ...prev,
      [csvColumn]: leadField
    }));
  };

  const validateMapping = () => {
    const mappedFields = Object.values(mapping).filter(field => field);
    return mappedFields.includes('name'); // Name is required
  };

  const handleImport = async () => {
    if (!validateMapping()) {
      alert('Please map at least the Name field');
      return;
    }

    setImporting(true);
    try {
      // Transform CSV data according to mapping
      const transformedData = csvData.map(row => {
        const lead: any = {
          lead_source: 'CSV Import',
          status: 'new',
          tags: [],
          custom_fields: {}
        };

        Object.entries(mapping).forEach(([csvColumn, leadField]) => {
          if (leadField && row[csvColumn]) {
            if (leadField === 'tags') {
              lead[leadField] = row[csvColumn].split(',').map((tag: string) => tag.trim());
            } else {
              lead[leadField] = row[csvColumn];
            }
          }
        });

        return lead;
      });

      // Mock import results
      const results = {
        total: transformedData.length,
        successful: Math.floor(transformedData.length * 0.95),
        failed: Math.ceil(transformedData.length * 0.05),
        errors: [
          { row: 5, error: 'Invalid email format' },
          { row: 12, error: 'Missing required name field' }
        ]
      };

      setImportResults(results);
      setActiveTab('results');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const uploadTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Select a CSV file containing your lead data. The first row should contain column headers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : 'Click to upload CSV file'}
                </p>
                <p className="text-sm text-gray-500">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'or drag and drop your file here'}
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {file && (
              <div className="flex justify-center">
                <Button onClick={() => setActiveTab('mapping')}>
                  Next: Map Fields
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Header Row Required</p>
                <p className="text-sm text-gray-600">First row must contain column names</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Name Field Required</p>
                <p className="text-sm text-gray-600">At least one column must contain lead names</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">UTF-8 Encoding</p>
                <p className="text-sm text-gray-600">File should be saved with UTF-8 encoding</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const mappingTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Map CSV Columns to Lead Fields</CardTitle>
          <CardDescription>
            Choose how each column in your CSV should be mapped to lead fields. Name field is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {csvHeaders.map((header, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{header}</div>
                  <div className="text-sm text-gray-500">
                    Sample: {csvData[0]?.[header] || 'N/A'}
                  </div>
                </div>
                <div className="w-64">
                  <Select
                    value={mapping[header] || ''}
                    onChange={(value) => updateMapping(header, value)}
                    options={leadFields}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab('upload')}>
              Back
            </Button>
            <Button 
              onClick={() => setActiveTab('preview')}
              disabled={!validateMapping()}
            >
              Preview Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const previewTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Preview</CardTitle>
          <CardDescription>
            Review how your data will be imported. Showing first 10 rows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {csvData.length} rows ready for import
            </div>
            <div className="flex space-x-2">
              <Badge variant="success">
                {Object.values(mapping).filter(field => field).length} fields mapped
              </Badge>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.slice(0, 10).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {Object.entries(mapping).find(([csv, field]) => field === 'name')?.[0] 
                      ? row[Object.entries(mapping).find(([csv, field]) => field === 'name')![0]]
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {Object.entries(mapping).find(([csv, field]) => field === 'email')?.[0] 
                      ? row[Object.entries(mapping).find(([csv, field]) => field === 'email')![0]]
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {Object.entries(mapping).find(([csv, field]) => field === 'phone_number')?.[0] 
                      ? row[Object.entries(mapping).find(([csv, field]) => field === 'phone_number')![0]]
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {Object.entries(mapping).find(([csv, field]) => field === 'company')?.[0] 
                      ? row[Object.entries(mapping).find(([csv, field]) => field === 'company')![0]]
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {Object.entries(mapping).find(([csv, field]) => field === 'title')?.[0] 
                      ? row[Object.entries(mapping).find(([csv, field]) => field === 'title')![0]]
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" size="sm">new</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab('mapping')}>
              Back to Mapping
            </Button>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Importing...' : `Import ${csvData.length} Leads`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const resultsTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Results</CardTitle>
          <CardDescription>
            Your lead import has been completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {importResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">{importResults.total}</div>
                  <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Import Errors</h4>
                  <div className="space-y-2">
                    {importResults.errors.map((error: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-red-50 rounded">
                        <Badge variant="destructive" size="sm">Row {error.row}</Badge>
                        <span className="text-sm">{error.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-3">
                <Link href="/dashboard/leads">
                  <Button>View Imported Leads</Button>
                </Link>
                <Button variant="outline" onClick={() => {
                  setFile(null);
                  setCsvData([]);
                  setCsvHeaders([]);
                  setMapping({});
                  setImportResults(null);
                  setActiveTab('upload');
                }}>
                  Import More Leads
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'upload', label: 'Upload', content: uploadTab },
    { id: 'mapping', label: 'Mapping', content: mappingTab },
    { id: 'preview', label: 'Preview', content: previewTab },
    { id: 'results', label: 'Results', content: resultsTab },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/leads">
          <Button variant="outline" size="sm">← Back to Leads</Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Import Leads</h1>
      </div>

      <Tabs 
        tabs={tabs} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}