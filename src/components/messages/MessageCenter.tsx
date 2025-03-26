
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leadsService, Lead } from '@/utils/leadsService';
import { toast } from 'sonner';
import { 
  Search, 
  Mail, 
  MessagesSquare, 
  MessageSquare,
  Filter,
  Inbox,
  Send,
  Archive,
  User,
  UserCheck
} from 'lucide-react';
import MessageList from './MessageList';
import MessagePreview from './MessagePreview';

// Helper to filter leads with their messages (request content)
const filterLeadsByType = (leads: Lead[], type: string) => {
  switch (type) {
    case 'registered':
      return leads.filter(lead => lead.isGuest === false);
    case 'guest':
      return leads.filter(lead => lead.isGuest === true);
    default:
      return leads;
  }
};

const MessageCenter = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messageType, setMessageType] = useState('all');
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const allLeads = await leadsService.getLeads();
      setLeads(allLeads);
      setFilteredLeads(allLeads);
      
      // If there are leads, select the first one by default
      if (allLeads.length > 0) {
        setSelectedLead(allLeads[0]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeads();
  }, []);
  
  useEffect(() => {
    const typeFiltered = filterLeadsByType(leads, messageType);
    
    const filtered = typeFiltered.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requestType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredLeads(filtered);
    
    // Update selected lead if it's no longer in the filtered list
    if (selectedLead && !filtered.some(lead => lead.id === selectedLead.id)) {
      setSelectedLead(filtered.length > 0 ? filtered[0] : null);
    }
  }, [searchQuery, leads, messageType, selectedLead]);
  
  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
  };
  
  const handleSendMessage = (message: string) => {
    if (!selectedLead) return;
    
    toast.success(`Message sent to ${selectedLead.name}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Message Center</h2>
        <p className="text-gray-500">Manage and respond to all lead messages</p>
      </div>
      
      <div className="flex flex-col space-y-4 h-[calc(100vh-300px)] min-h-[500px]">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={messageType} 
            onValueChange={setMessageType}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">
                <Inbox size={16} className="mr-2" />
                All
              </TabsTrigger>
              <TabsTrigger value="registered">
                <UserCheck size={16} className="mr-2" />
                Registered
              </TabsTrigger>
              <TabsTrigger value="guest">
                <User size={16} className="mr-2" />
                Guest
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessagesSquare size={18} className="mr-2" />
                Messages
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  {filteredLeads.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[500px]">
              <MessageList 
                leads={filteredLeads} 
                selectedLead={selectedLead} 
                onSelectLead={handleLeadSelect}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <MessagePreview 
              lead={selectedLead} 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
