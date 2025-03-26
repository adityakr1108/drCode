
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leadsService, Lead } from '@/utils/leadsService';
import { toast } from 'sonner';
import { 
  Brain, 
  MessagesSquare, 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  Target,
  Sparkles,
  BarChart3,
  PieChart
} from 'lucide-react';
import LeadInsightCard from './LeadInsightCard';

// Mock AI generated insights based on lead data
const generateInsights = (leads: Lead[]) => {
  if (!leads.length) return [];
  
  // Group leads by status
  const statusGroups: Record<string, Lead[]> = {};
  leads.forEach(lead => {
    if (!statusGroups[lead.status]) statusGroups[lead.status] = [];
    statusGroups[lead.status].push(lead);
  });
  
  // Generate insights
  const insights = [];
  
  // New leads insight
  if (statusGroups.new && statusGroups.new.length > 0) {
    insights.push({
      id: 1,
      title: 'New Leads Analysis',
      content: `You have ${statusGroups.new.length} new leads waiting for initial contact. The AI analysis suggests prioritizing ${
        statusGroups.new.filter(l => l.score > 70).length
      } high-scoring leads first for optimal conversion rates.`,
      icon: <Zap size={18} />,
      actionLabel: 'View High Priority Leads',
      type: 'lead-analysis'
    });
  }
  
  // Conversion opportunity
  const qualifiedCount = statusGroups.qualified ? statusGroups.qualified.length : 0;
  if (qualifiedCount > 0) {
    insights.push({
      id: 2,
      title: 'Conversion Opportunity',
      content: `${qualifiedCount} qualified leads are ready for follow-up. Based on their interaction patterns and score profiles, they have a 72% likelihood of converting with proper engagement.`,
      icon: <Target size={18} />,
      actionLabel: 'View Strategy',
      type: 'conversion'
    });
  }
  
  // Message pattern analysis
  const messageAnalysis = `Analysis of prospect messages shows a 38% increase in requests for product demonstrations. Consider creating more targeted demo materials focusing on key features mentioned: integration capabilities, data security, and automation workflows.`;
  insights.push({
    id: 3,
    title: 'Message Pattern Analysis',
    content: messageAnalysis,
    icon: <MessagesSquare size={18} />,
    actionLabel: 'View Full Report',
    type: 'message-analysis'
  });
  
  // Performance trend
  insights.push({
    id: 4,
    title: 'Performance Trend',
    content: 'Lead quality scores have increased by 12% over the past 30 days, suggesting your current marketing channels are attracting better-qualified prospects. Continue focusing on professional service inquiries which show the highest engagement rates.',
    icon: <TrendingUp size={18} />,
    actionLabel: 'View Channels',
    type: 'performance'
  });
  
  // Recommendation
  const topRequestType = leads.reduce((acc: {type: string, count: number}[], lead) => {
    const existing = acc.find(item => item.type === lead.requestType);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type: lead.requestType, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count)[0]?.type || 'Product Inquiry';
  
  insights.push({
    id: 5,
    title: 'Strategic Recommendation',
    content: `Based on the high volume of "${topRequestType}" inquiries, consider developing specialized content and response templates for this category to improve conversion rates. Our analysis suggests a potential 23% increase in conversions with this targeted approach.`,
    icon: <Lightbulb size={18} />,
    actionLabel: 'Implement Strategy',
    type: 'recommendation'
  });
  
  return insights;
};

const AIInsights = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leadFilter, setLeadFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisType, setAnalysisType] = useState('predictive');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const leads = await leadsService.getLeads();
        setInsights(generateInsights(leads));
      } catch (error) {
        console.error('Error fetching data for AI insights:', error);
        toast.error('Failed to load AI insights');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const runFullAnalysis = () => {
    setIsLoading(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Running comprehensive AI analysis...',
        success: 'Full analysis complete. New insights generated.',
        error: 'Analysis failed. Please try again.',
      }
    ).then(() => setIsLoading(false));
  };
  
  const filteredInsights = insights.filter(insight => 
    searchQuery ? insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  insight.content.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">AI Insights</h2>
          <p className="text-gray-500">AI-powered analysis and recommendations for your leads</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <Button variant="default" onClick={runFullAnalysis} disabled={isLoading}>
            <Brain size={16} className="mr-2" />
            Run Full Analysis
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input 
            placeholder="Search insights..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <Select value={leadFilter} onValueChange={setLeadFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter leads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
              <SelectItem value="new">New Leads</SelectItem>
              <SelectItem value="qualified">Qualified Leads</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="predictive">Predictive Analysis</SelectItem>
              <SelectItem value="behavioral">Behavioral Analysis</SelectItem>
              <SelectItem value="conversion">Conversion Analysis</SelectItem>
              <SelectItem value="trend">Trend Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">
            <Sparkles size={16} className="mr-2" />
            Key Insights
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Lightbulb size={16} className="mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 size={16} className="mr-2" />
            AI Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredInsights.length > 0 ? (
              filteredInsights.map(insight => (
                <LeadInsightCard key={insight.id} insight={insight} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="bg-primary/10 mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4">
                  <Brain size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium">No insights found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or run a new analysis</p>
                <Button onClick={runFullAnalysis} className="mt-4">
                  Generate New Insights
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
              <CardDescription>
                AI-generated recommendations based on your lead data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Focus on High-Value Leads
                  </h3>
                  <p className="text-gray-600">
                    Prioritize the 8 leads with scores above 80. These leads have shown consistent engagement patterns
                    and their message content indicates strong purchase intent.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">Apply Filter</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessagesSquare className="mr-2 h-5 w-5 text-primary" />
                    Optimize Response Times
                  </h3>
                  <p className="text-gray-600">
                    Data shows a 35% higher conversion rate when leads are contacted within 2 hours.
                    Consider implementing automated initial responses for off-hours inquiries.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">Setup Automation</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-primary" />
                    Content Strategy Adjustment
                  </h3>
                  <p className="text-gray-600">
                    Analysis of lead messages reveals increasing interest in integration capabilities.
                    Creating targeted content around your API and integration options could improve conversion rates.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">Content Planner</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Generated Reports</CardTitle>
              <CardDescription>
                Comprehensive analysis reports based on your lead data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mr-4 bg-primary/10 p-2 rounded">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Lead Quality Analysis Report</h3>
                        <p className="text-sm text-gray-500">Generated 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mr-4 bg-primary/10 p-2 rounded">
                        <PieChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Conversion Opportunity Report</h3>
                        <p className="text-sm text-gray-500">Generated 1 week ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mr-4 bg-primary/10 p-2 rounded">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Lead Source Performance</h3>
                        <p className="text-sm text-gray-500">Generated 1 month ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Button onClick={runFullAnalysis}>
                    <Brain size={16} className="mr-2" />
                    Generate New Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsights;
