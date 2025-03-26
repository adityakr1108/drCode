
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Clock, Mail, MessageSquare, Trash2, ExternalLink } from 'lucide-react';
import { LeadStatus, Lead, leadsService } from '@/utils/leadsService';
import LeadInteraction from './LeadInteraction';

interface LeadDetailDialogProps {
  leadId: string;
  isAdmin?: boolean;
  onLeadUpdated: () => void;
  trigger?: React.ReactNode;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-amber-100 text-amber-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

const LeadDetailDialog = ({ leadId, isAdmin = false, onLeadUpdated, trigger }: LeadDetailDialogProps) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<LeadStatus | ''>('');
  
  const fetchLead = async () => {
    setLoading(true);
    try {
      const leadData = await leadsService.getLead(leadId);
      setLead(leadData || null);
      if (leadData) {
        setStatus(leadData.status);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const handleStatusChange = async () => {
    if (!lead || !status || status === lead.status) return;
    
    try {
      await leadsService.updateLeadStatus(leadId, status);
      fetchLead();
      onLeadUpdated();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleDelete = async () => {
    if (!lead) return;
    
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsService.deleteLead(leadId);
        onLeadUpdated();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    if (score >= 40) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Handle SelectValue change with type safety
  const handleSelectChange = (value: string) => {
    setStatus(value as LeadStatus);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className={isAdmin ? "flex-1" : "w-full"}>
            {isAdmin ? "View Details" : <><ExternalLink size={14} className="mr-1" /> View Details</>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : lead ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{lead.name}</DialogTitle>
                    <DialogDescription className="text-sm flex items-center mt-1">
                      <Mail size={14} className="mr-1" /> {lead.email}
                    </DialogDescription>
                  </div>
                </div>
                <Badge className={statusColors[lead.status]}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Lead Score</span>
                <span className={`text-sm font-medium rounded-full py-1 px-3 inline-flex items-center w-fit ${getScoreColor(lead.score)}`}>
                  <BarChart size={14} className="mr-2" />
                  {lead.score}/100
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Last Activity</span>
                <span className="text-sm text-gray-700 flex items-center">
                  <Clock size={14} className="mr-2 text-gray-500" />
                  {lead.lastActivity}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Request Type</span>
                <span className="text-sm text-gray-700">{lead.requestType}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Interactions</span>
                <span className="text-sm text-gray-700 flex items-center">
                  <MessageSquare size={14} className="mr-2 text-gray-500" />
                  {lead.interactions}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-sm text-gray-500 mb-2 block">Message</span>
              <div className="border rounded-lg p-4 bg-gray-50 text-gray-700 whitespace-pre-wrap text-sm">
                {lead.message}
              </div>
            </div>

            {isAdmin && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Update Status:</span>
                  <Select 
                    value={status} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleStatusChange}
                    disabled={!status || status === lead.status}
                  >
                    Update
                  </Button>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <LeadInteraction 
                    leadId={lead.id}
                    recipientEmail={lead.email}
                    recipientName={lead.name}
                    isAdmin={true}
                    onInteractionComplete={() => {
                      fetchLead();
                      onLeadUpdated();
                    }}
                  />
                  <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete}>
                    <Trash2 size={14} className="mr-1" /> Delete Lead
                  </Button>
                </div>
              </div>
            )}

            {!isAdmin && (
              <div className="mt-6">
                <LeadInteraction 
                  leadId={lead.id}
                  onInteractionComplete={() => {
                    fetchLead();
                    onLeadUpdated();
                  }}
                />
              </div>
            )}

            <div className="mt-6 pt-4 border-t text-right">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Lead not found</p>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4">Close</Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
