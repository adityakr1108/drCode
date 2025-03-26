
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { leadsService, Lead } from '@/utils/leadsService';

interface SourceData {
  source: string;
  count: number;
  color: string;
}

const LeadSourceChart = () => {
  const [data, setData] = useState<SourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const leads = await leadsService.getLeads();
        
        // Group leads by request type
        const requestTypes: Record<string, number> = {};
        leads.forEach(lead => {
          if (requestTypes[lead.requestType]) {
            requestTypes[lead.requestType]++;
          } else {
            requestTypes[lead.requestType] = 1;
          }
        });
        
        // Create chart data
        const colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const chartData = Object.entries(requestTypes).map(([source, count], index) => ({
          source,
          count,
          color: colors[index % colors.length],
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching lead source data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="source" />
              <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
              <Bar dataKey="count" name="Leads" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadSourceChart;
