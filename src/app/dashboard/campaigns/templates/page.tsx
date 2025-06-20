'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CAMPAIGN_TEMPLATES_LIBRARY, TEMPLATE_CATEGORIES, getTemplatesByCategory } from '@/data/campaignTemplates';

export default function CampaignTemplatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = CAMPAIGN_TEMPLATES_LIBRARY.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                          template.industry?.toLowerCase().replace(/\s+/g, '_') === selectedCategory ||
                          (selectedCategory === 'financial' && template.industry === 'Financial Services');
    
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (templateId: string) => {
    router.push(`/dashboard/campaigns/create?template=${templateId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Templates</h1>
          <p className="text-gray-600">
            Choose from {CAMPAIGN_TEMPLATES_LIBRARY.length}+ industry-specific templates to launch your AI campaigns
          </p>
        </div>
        <Link href="/dashboard/campaigns/create">
          <Button variant="outline">Create Custom Campaign</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates by industry, use case, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Browse by Industry</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-3 rounded-lg border text-left transition-colors ${
              selectedCategory === 'all'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">All Industries</div>
            <div className="text-sm text-gray-500">{CAMPAIGN_TEMPLATES_LIBRARY.length} templates</div>
          </button>
          
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{category.icon}</span>
                <div className="font-medium">{category.name}</div>
              </div>
              <div className="text-sm text-gray-500">{category.description}</div>
              <div className="text-xs text-gray-400 mt-1">{category.templateCount} templates</div>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedCategory === 'all' ? 'All Templates' : 
             TEMPLATE_CATEGORIES.find(c => c.id === selectedCategory)?.name + ' Templates'} 
            ({filteredTemplates.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <div className="ml-2">
                    {template.industry && (
                      <Badge variant="outline" size="sm">
                        {template.industry}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-gray-600">{template.estimated_duration_days} days</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Sequence</div>
                      <div className="text-gray-600">{template.sequence.length} steps</div>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  {template.estimatedConversionRate && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Expected Conversion</div>
                      <div className="text-green-600 font-medium">{template.estimatedConversionRate}</div>
                    </div>
                  )}

                  {/* Recommended For */}
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Best for:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.recommended_for.slice(0, 2).map((use, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {use}
                        </Badge>
                      ))}
                      {template.recommended_for.length > 2 && (
                        <Badge variant="secondary" size="sm">
                          +{template.recommended_for.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Sequence Preview */}
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Sequence:</div>
                    <div className="space-y-1">
                      {template.sequence.slice(0, 3).map((step, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 truncate">
                            {step.name}
                          </div>
                          <Badge variant="outline" size="sm">
                            {step.channel}
                          </Badge>
                        </div>
                      ))}
                      {template.sequence.length > 3 && (
                        <div className="text-xs text-gray-500 ml-6">
                          +{template.sequence.length - 3} more steps
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => useTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Preview functionality - could open a modal
                        console.log('Preview template:', template.id);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              No templates found matching your criteria
            </div>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Don't see a template for your industry?
          </h3>
          <p className="text-blue-700 mb-4">
            Create a custom campaign or contact us to add industry-specific templates.
          </p>
          <div className="flex justify-center space-x-3">
            <Link href="/dashboard/campaigns/create">
              <Button>Create Custom Campaign</Button>
            </Link>
            <Button variant="outline">
              Request Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}