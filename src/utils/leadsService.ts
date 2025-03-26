
import { toast } from "sonner";

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  status: LeadStatus;
  lastActivity: string;
  requestType: string;
  message: string;
  interactions: number;
  isGuest?: boolean; // Property to identify guest vs logged-in user leads
}

// Initial mock data
const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    score: 85,
    status: 'qualified',
    lastActivity: '2 days ago',
    requestType: 'Product Inquiry',
    message: 'I\'m interested in your AI lead scoring system. Can you tell me more about the pricing?',
    interactions: 8,
    isGuest: false
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    score: 72,
    status: 'contacted',
    lastActivity: '5 days ago',
    requestType: 'Demo Request',
    message: 'We\'re looking for a lead management system for our sales team of 15 people. Would like to see how your platform works.',
    interactions: 3,
    isGuest: true
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    score: 45,
    status: 'new',
    lastActivity: '1 week ago',
    requestType: 'Support',
    message: 'Having some questions about the WhatsApp integration. How does it work with our existing system?',
    interactions: 1,
    isGuest: true
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    score: 92,
    status: 'qualified',
    lastActivity: '1 day ago',
    requestType: 'Demo Request',
    message: 'Our marketing team is looking for a new lead management solution that integrates with our CRM. Would like to see a demo.',
    interactions: 5,
    isGuest: false
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david@example.com',
    score: 31,
    status: 'new',
    lastActivity: '3 days ago',
    requestType: 'Pricing',
    message: 'How much does your basic plan cost? We\'re a small business with about 5 sales reps.',
    interactions: 2,
    isGuest: true
  },
  {
    id: '6',
    name: 'Jessica Chen',
    email: 'jessica@example.com',
    score: 78,
    status: 'contacted',
    lastActivity: '4 days ago',
    requestType: 'Product Inquiry',
    message: 'Does your platform integrate with Salesforce? We need a solution that works with our existing tech stack.',
    interactions: 4,
    isGuest: false
  },
];

// Use localStorage to persist leads data
const getStoredLeads = (): Lead[] => {
  const storedLeads = localStorage.getItem('leadflow_leads');
  if (storedLeads) {
    try {
      return JSON.parse(storedLeads);
    } catch (error) {
      console.error('Error parsing stored leads:', error);
      return [...initialLeads];
    }
  }
  return [...initialLeads];
};

// Save leads to localStorage
const saveLeads = (leads: Lead[]) => {
  localStorage.setItem('leadflow_leads', JSON.stringify(leads));
};

// Initialize with stored or initial data
let leads = getStoredLeads();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API simulation functions
export const leadsService = {
  // Get all leads
  getLeads: async (): Promise<Lead[]> => {
    await delay(600); // Simulate network delay
    return [...leads];
  },

  // Get leads for a specific user by email
  getUserLeads: async (email: string): Promise<Lead[]> => {
    await delay(600);
    // Return leads that match the user's email AND have isGuest set to false
    return leads.filter(lead => lead.email === email && lead.isGuest === false);
  },

  // Get guest leads (for admin dashboard)
  getGuestLeads: async (): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => lead.isGuest === true);
  },

  // Get user leads (for admin dashboard)
  getRegisteredUserLeads: async (): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => lead.isGuest === false);
  },

  // Get lead by ID
  getLead: async (id: string): Promise<Lead | undefined> => {
    await delay(300);
    return leads.find(lead => lead.id === id);
  },

  // Update lead status
  updateLeadStatus: async (id: string, status: LeadStatus): Promise<Lead | undefined> => {
    await delay(500);
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], status };
      saveLeads(leads);
      toast.success("Lead status updated successfully");
      return leads[index];
    }
    toast.error("Failed to update lead status");
    return undefined;
  },

  // Add a new lead
  addLead: async (lead: Omit<Lead, 'id' | 'score' | 'lastActivity' | 'interactions'>, isGuest: boolean = true): Promise<Lead> => {
    await delay(800);
    
    // Generate random ID
    const id = Math.random().toString(36).substring(2, 9);
    
    // Calculate an AI score based on message length and requestType
    let score = Math.floor(Math.random() * 40) + 30; // Base score 30-70
    if (lead.message.length > 100) score += 15;
    if (lead.requestType === 'Demo Request') score += 20;
    if (lead.requestType === 'Product Inquiry') score += 10;
    score = Math.min(score, 99); // Cap at 99
    
    const newLead: Lead = {
      id,
      ...lead,
      score,
      lastActivity: 'Just now',
      interactions: 1,
      isGuest
    };
    
    leads = [newLead, ...leads];
    saveLeads(leads);
    toast.success("New lead added successfully");
    return newLead;
  },

  // Add interaction to a lead
  addInteraction: async (id: string, message: string): Promise<Lead | undefined> => {
    await delay(400);
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      leads[index] = { 
        ...leads[index], 
        interactions: leads[index].interactions + 1,
        lastActivity: 'Just now'
      };
      saveLeads(leads);
      toast.success("Interaction recorded");
      return leads[index];
    }
    toast.error("Failed to record interaction");
    return undefined;
  },

  // Delete a lead
  deleteLead: async (id: string): Promise<boolean> => {
    await delay(500);
    const initialLength = leads.length;
    leads = leads.filter(lead => lead.id !== id);
    if (leads.length < initialLength) {
      saveLeads(leads);
      toast.success("Lead deleted successfully");
      return true;
    }
    toast.error("Failed to delete lead");
    return false;
  }
};
