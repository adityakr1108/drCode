
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Clock, MessageSquare } from 'lucide-react';
import LeadDetailDialog from './LeadDetailDialog';
import LeadInteraction from './LeadInteraction';
import { Lead } from '@/utils/leadsService';

interface LeadCardProps {
  lead: Lead;
  isAdmin?: boolean;
  onLeadUpdated: () => void;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-amber-100 text-amber-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

const LeadCard = ({ lead, isAdmin = false, onLeadUpdated }: LeadCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    if (score >= 40) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100">
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold">{lead.name}</CardTitle>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>
        </div>
        
        <Badge className={statusColors[lead.status]}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Lead Score</span>
            <span className={`text-sm font-medium rounded-full py-0.5 px-2 inline-flex items-center w-fit ${getScoreColor(lead.score)}`}>
              <BarChart size={14} className="mr-1" />
              {lead.score}/100
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Last Activity</span>
            <span className="text-sm text-gray-700 flex items-center">
              <Clock size={14} className="mr-1 text-gray-500" />
              {lead.lastActivity}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Request Type</span>
            <span className="text-sm text-gray-700">{lead.requestType}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Interactions</span>
            <span className="text-sm text-gray-700 flex items-center">
              <MessageSquare size={14} className="mr-1 text-gray-500" />
              {lead.interactions}
            </span>
          </div>
        </div>
        
        <div className="mt-2">
          <span className="text-xs text-gray-500 mb-1 block">Message</span>
          <p className="text-sm text-gray-700 line-clamp-2">{lead.message}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        {isAdmin ? (
          <>
            <LeadInteraction 
              leadId={lead.id} 
              isAdmin={true} 
              onInteractionComplete={onLeadUpdated} 
            />
            <LeadDetailDialog
              leadId={lead.id}
              isAdmin={true}
              onLeadUpdated={onLeadUpdated}
            />
          </>
        ) : (
          <LeadDetailDialog
            leadId={lead.id}
            onLeadUpdated={onLeadUpdated}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
