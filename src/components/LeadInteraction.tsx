
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail } from 'lucide-react';
import { LeadStatus, leadsService } from '@/utils/leadsService';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface LeadInteractionProps {
  leadId: string;
  recipientEmail?: string;
  recipientName?: string;
  isAdmin?: boolean;
  onInteractionComplete: () => void;
}

const LeadInteraction = ({ 
  leadId, 
  recipientEmail, 
  recipientName,
  isAdmin = false, 
  onInteractionComplete 
}: LeadInteractionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Record the interaction
      if (message.trim()) {
        await leadsService.addInteraction(leadId, message);
      }
      
      // Update status if changed and admin
      if (isAdmin && newStatus) {
        await leadsService.updateLeadStatus(leadId, newStatus as LeadStatus);
      }
      
      // Send email if admin
      if (isAdmin && recipientEmail && subject.trim() && message.trim()) {
        // In a real application, this would connect to an email API
        // For now, we'll simulate email sending with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`Email sent to ${recipientEmail}`);
      }
      
      onInteractionComplete();
      setMessage('');
      setSubject('');
      setNewStatus('');
    } catch (error) {
      console.error('Error during lead interaction:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle SelectValue change with type safety
  const handleSelectChange = (value: string) => {
    setNewStatus(value as LeadStatus);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant={isAdmin ? "default" : "outline"} className={isAdmin ? "flex-1" : "w-full"}>
          {isAdmin ? (
            <>
              <Mail size={14} className="mr-1" /> Email
            </>
          ) : (
            <>
              <MessageSquare size={14} className="mr-1" /> Respond
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAdmin 
              ? `Email to ${recipientName || 'Lead'}`
              : "Respond to Your Request"
            }
          </DialogTitle>
          <DialogDescription>
            {isAdmin 
              ? `Send an email to ${recipientEmail || 'the lead'} and update their status if needed.` 
              : "Add additional information or respond to your request."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {isAdmin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">To:</label>
              <Input value={recipientEmail || ''} readOnly className="bg-gray-50" />
            </div>
          )}

          {isAdmin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject:</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required={isAdmin}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Message:</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              required
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Update Lead Status</div>
              <Select 
                value={newStatus} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Keep current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : isAdmin ? 'Send Email' : 'Send Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadInteraction;
