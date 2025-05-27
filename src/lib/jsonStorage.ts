// src/lib/jsonStorage.ts
import { promises as fs } from 'fs';
import path from 'path';

export interface LeadActivity {
  id: string;
  type: 'email_sent' | 'sms_sent' | 'tag_added' | 'tag_removed' | 'digital_pass_clicked' | 
        'team_notification' | 'app_notification' | 'google_sheets_sync' | 'reminder_email_sent' | 
        'workflow_completed' | 'custom' | 'reminder_email_failed' | 'tagActivity' | 'employee_key_email_sent' | 'employee_key_email_failed' | 
        'employee_key_confirmation_sent' | 'employee_key_confirmation_failed' | 'employee_key_recovery_sent' | 'employee_key_recovery_failed' | 'confirmation_email_sent';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface LeadData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    full: string;
  };
  companyName:string;
  gymLocation: string;
  jobTitle: string;
  employeeListSize: string;
  hasPassword: boolean;
  employeeKey: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    full: string;
  };
  submittedAt: string;
  source?: string;
  tags: string[];
  activities: LeadActivity[];
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  lastActivityAt: string;
}

export interface JsonStorageData {
  leads: LeadData[];
  metadata: {
    created: string;
    lastUpdated: string;
    totalCount: number;
  };
}

// File path to the JSON storage
const DATA_PATH = path.join(process.cwd(), 'data', 'ufc_form_leads.json');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backup');

// Initialize the JSON file with default structure
export async function initializeJsonFile(): Promise<void> {
  try {
    const dataDir = path.dirname(DATA_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    let needsInitialization = false;
    
    try {
      await fs.access(DATA_PATH);
      const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
      
      if (!fileContent.trim()) {
        console.log('JSON file is empty, reinitializing...');
        needsInitialization = true;
      } else {
        try {
          const parsedData = JSON.parse(fileContent);
          if (!parsedData.leads || !parsedData.metadata) {
            console.log('JSON file has invalid structure, reinitializing...');
            needsInitialization = true;
          } else {
            console.log('JSON storage file already exists and is valid');
            return;
          }
        } catch (parseError) {
          console.log('JSON file is corrupted, reinitializing...');
          needsInitialization = true;
        }
      }
    } catch {
      console.log('JSON file does not exist, creating...');
      needsInitialization = true;
    }

    if (needsInitialization) {
      const initialData: JsonStorageData = {
        leads: [],
        metadata: {
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          totalCount: 0
        }
      };

      await fs.writeFile(DATA_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      console.log('JSON storage file initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing JSON file:', error);
    throw new Error('Failed to initialize JSON storage file');
  }
}

// Read data from JSON file with better error handling
export async function readJsonData(): Promise<JsonStorageData> {
  try {
    await initializeJsonFile();
    
    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    
    if (!fileContent.trim()) {
      throw new Error('JSON file is empty after initialization');
    }
    
    const parsedData = JSON.parse(fileContent);
    
    if (!parsedData.leads || !parsedData.metadata) {
      throw new Error('JSON file has invalid structure');
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error reading JSON data:', error);
    
    console.log('Attempting to recreate JSON file...');
    try {
      const initialData: JsonStorageData = {
        leads: [],
        metadata: {
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          totalCount: 0
        }
      };
      
      await fs.writeFile(DATA_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    } catch (recreateError) {
      console.error('Failed to recreate JSON file:', recreateError);
      throw new Error('Failed to read or recreate JSON storage file');
    }
  }
}

// Write data to JSON file with atomic operation
export async function writeJsonData(data: JsonStorageData): Promise<void> {
  try {
    data.metadata.lastUpdated = new Date().toISOString();
    data.metadata.totalCount = data.leads.length;

    const tempPath = `${DATA_PATH}.tmp`;
    const jsonContent = JSON.stringify(data, null, 2);
    
    await fs.writeFile(tempPath, jsonContent, 'utf-8');
    await fs.rename(tempPath, DATA_PATH);
    
    console.log('JSON data written successfully');
  } catch (error) {
    console.error('Error writing JSON data:', error);
    
    try {
      await fs.unlink(`${DATA_PATH}.tmp`);
    } catch {
      // Ignore cleanup errors
    }
    
    throw new Error('Failed to write JSON storage file');
  }
}

// Add a new lead to the JSON file
export async function addLead(leadData: Omit<LeadData, 'id' | 'tags' | 'activities' | 'status' | 'lastActivityAt'>): Promise<LeadData> {
  try {
    const data = await readJsonData();
    
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newLead: LeadData = {
      id,
      ...leadData,
      tags: [],
      activities: [{
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'custom',
        description: 'Lead created',
        timestamp: now,
        metadata: { source: leadData.source || 'web_form' }
      }],
      status: 'new',
      lastActivityAt: now
    };

    data.leads.push(newLead);
    await writeJsonData(data);
    
    console.log(`New lead added with ID: ${id}`);
    return newLead;
  } catch (error) {
    console.error('Error adding lead:', error);
    throw new Error('Failed to add lead to storage');
  }
}

// Add or update lead
export async function upsertLead(leadData: {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    full: string;
  };
  companyName: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    full: string;
  };
  gymLocation: string;
  employeeKey: string;
  source: string;
  jobTitle: string;
  submittedAt: string;
  employeeListSize: string;
  hasPassword: boolean;
}): Promise<any> {
  try {
    // Check if lead already exists by email
    const existingLeads = await getLeadsByEmail(leadData.email);
    
    if (existingLeads.length > 0) {
      console.log(`Lead with email ${leadData.email} already exists, updating instead of creating duplicate`);
      
      const existingLead = existingLeads[0];
      const data = await readJsonData();
      const leadIndex = data.leads.findIndex(lead => lead.id === existingLead.id);
      
      if (leadIndex !== -1) {
        data.leads[leadIndex] = {
          ...data.leads[leadIndex],
          ...leadData,
          lastActivityAt: new Date().toISOString()
        };
        
        const updateActivity: LeadActivity = {
          id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'custom',
          description: 'Lead information updated',
          timestamp: new Date().toISOString(),
          metadata: { action: 'upsert' }
        };
        
        data.leads[leadIndex].activities.push(updateActivity);
        
        await writeJsonData(data);
        console.log(`Lead updated: ${existingLead.id}`);
        return data.leads[leadIndex];
      }
    }
    
    // If no existing lead found, create a new one
    return await addLead(leadData);
    
  } catch (error) {
    console.error('Error upserting lead:', error);
    throw new Error('Failed to upsert lead');
  }
}

// Update lead tags
export async function updateLeadTags(
  leadId: string, 
  tags: string[], 
  action: 'set' | 'add' | 'remove' = 'set'
): Promise<LeadData | null> {
  try {
    const data = await readJsonData();
    const leadIndex = data.leads.findIndex(lead => lead.id === leadId);
    
    if (leadIndex === -1) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    const lead = data.leads[leadIndex];
    
    switch (action) {
      case 'set':
        lead.tags = [...tags];
        break;
      case 'add':
        const newTags = tags.filter(tag => !lead.tags.includes(tag));
        lead.tags = [...lead.tags, ...newTags];
        break;
      case 'remove':
        lead.tags = lead.tags.filter(tag => !tags.includes(tag));
        break;
    }

    lead.lastActivityAt = new Date().toISOString();
    await writeJsonData(data);
    
    console.log(`Updated tags for lead ${leadId}: ${lead.tags.join(', ')}`);
    return lead;
  } catch (error) {
    console.error('Error updating lead tags:', error);
    throw new Error('Failed to update lead tags');
  }
}

// Add activity to lead
export async function addLeadActivity(
    leadId: string, 
    activity: Omit<LeadActivity, 'id'>
  ): Promise<LeadData | null> {
    try {
      const data = await readJsonData();
      const leadIndex = data.leads.findIndex(lead => lead.id === leadId);
      
      if (leadIndex === -1) {
        throw new Error(`Lead not found with ID: ${leadId}`);
      }
  
      const lead = data.leads[leadIndex];
      
      // Safety check: Initialize activities array if it doesn't exist
      if (!Array.isArray(lead.activities)) {
        console.log(`Initializing missing activities array for lead ${leadId}`);
        lead.activities = [];
      }
      
      const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newActivity: LeadActivity = {
        id: activityId,
        ...activity
      };
  
      lead.activities.push(newActivity);
      lead.lastActivityAt = activity.timestamp;
      
      await writeJsonData(data);
      
      console.log(`Added activity to lead ${leadId}: ${activity.description}`);
      return lead;
    } catch (error) {
      console.error('Error adding lead activity:', error);
      throw new Error('Failed to add lead activity');
    }
  }

// Update lead status
export async function updateLeadStatus(
  leadId: string, 
  status: LeadData['status']
): Promise<LeadData | null> {
  try {
    const data = await readJsonData();
    const leadIndex = data.leads.findIndex(lead => lead.id === leadId);
    
    if (leadIndex === -1) {
      throw new Error(`Lead not found with ID: ${leadId}`);
    }

    const lead = data.leads[leadIndex];
    const oldStatus = lead.status;
    lead.status = status;
    lead.lastActivityAt = new Date().toISOString();

    // Add status change activity
    const activity: LeadActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'custom',
      description: `Status changed from ${oldStatus} to ${status}`,
      timestamp: new Date().toISOString(),
      metadata: { oldStatus, newStatus: status }
    };
    
    lead.activities.push(activity);
    await writeJsonData(data);
    
    console.log(`Updated status for lead ${leadId}: ${oldStatus} -> ${status}`);
    return lead;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw new Error('Failed to update lead status');
  }
}

// Get all leads
export async function getAllLeads(): Promise<LeadData[]> {
  try {
    const data = await readJsonData();
    return data.leads;
  } catch (error) {
    console.error('Error getting all leads:', error);
    throw new Error('Failed to retrieve leads');
  }
}

// Get lead by ID
export async function getLeadById(id: string): Promise<LeadData | null> {
  try {
    const data = await readJsonData();
    return data.leads.find(lead => lead.id === id) || null;
  } catch (error) {
    console.error('Error getting lead by ID:', error);
    throw new Error('Failed to retrieve lead');
  }
}

// Get leads by email
export async function getLeadsByEmail(email: string): Promise<LeadData[]> {
  try {
    const data = await readJsonData();
    return data.leads.filter(lead => lead.email.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error('Error getting leads by email:', error);
    throw new Error('Failed to retrieve leads by email');
  }
}

// Get leads by tag
export async function getLeadsByTag(tag: string): Promise<LeadData[]> {
  try {
    const data = await readJsonData();
    return data.leads.filter(lead => lead.tags.includes(tag));
  } catch (error) {
    console.error('Error getting leads by tag:', error);
    throw new Error('Failed to retrieve leads by tag');
  }
}

// Get leads by status
export async function getLeadsByStatus(status: LeadData['status']): Promise<LeadData[]> {
  try {
    const data = await readJsonData();
    return data.leads.filter(lead => lead.status === status);
  } catch (error) {
    console.error('Error getting leads by status:', error);
    throw new Error('Failed to retrieve leads by status');
  }
}

// Search leads by various criteria
export async function searchLeads(searchCriteria: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  tags?: string[];
  status?: LeadData['status'];
}): Promise<LeadData[]> {
  try {
    const data = await readJsonData();
    
    return data.leads.filter(lead => {
      const matchesFirstName = !searchCriteria.firstName || 
        lead.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase());
      
      const matchesLastName = !searchCriteria.lastName || 
        lead.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase());
      
      const matchesEmail = !searchCriteria.email || 
        lead.email.toLowerCase().includes(searchCriteria.email.toLowerCase());
      
      const matchesPhone = !searchCriteria.phone || 
        lead.phone.includes(searchCriteria.phone);
      
      const matchesCity = !searchCriteria.city || 
        lead.address.city.toLowerCase().includes(searchCriteria.city.toLowerCase());
      
      const matchesState = !searchCriteria.state || 
        lead.address.state.toLowerCase().includes(searchCriteria.state.toLowerCase());

      const matchesTags = !searchCriteria.tags || 
        searchCriteria.tags.some(tag => lead.tags.includes(tag));

      const matchesStatus = !searchCriteria.status || 
        lead.status === searchCriteria.status;

      return matchesFirstName && matchesLastName && matchesEmail && 
             matchesPhone && matchesCity && matchesState && matchesTags && matchesStatus;
    });
  } catch (error) {
    console.error('Error searching leads:', error);
    throw new Error('Failed to search leads');
  }
}

// Get recent leads (last N days)
export async function getRecentLeads(days: number = 7): Promise<LeadData[]> {
  try {
    const data = await readJsonData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return data.leads.filter(lead => {
      const submitDate = new Date(lead.submittedAt);
      return submitDate >= cutoffDate;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch (error) {
    console.error('Error getting recent leads:', error);
    throw new Error('Failed to retrieve recent leads');
  }
}

// Create backup of current data
export async function createBackup(): Promise<string> {
  try {
    const data = await readJsonData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `leads-backup-${timestamp}.json`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);
    
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
    console.log(`Backup created: ${backupFileName}`);
    return backupPath;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
}

// Get storage statistics
export async function getStorageStats(): Promise<{
  totalLeads: number;
  fileSize: string;
  lastUpdated: string;
  oldestLead?: string;
  newestLead?: string;
  tagStats: Record<string, number>;
  statusStats: Record<string, number>;
}> {
  try {
    const data = await readJsonData();
    const stats = await fs.stat(DATA_PATH);
    
    const leads = data.leads;
    const sortedLeads = leads.sort((a, b) => 
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    // Calculate tag statistics
    const tagStats: Record<string, number> = {};
    leads.forEach(lead => {
      lead.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      });
    });

    // Calculate status statistics
    const statusStats: Record<string, number> = {};
    leads.forEach(lead => {
      statusStats[lead.status] = (statusStats[lead.status] || 0) + 1;
    });

    return {
      totalLeads: data.metadata.totalCount,
      fileSize: `${(stats.size / 1024).toFixed(2)} KB`,
      lastUpdated: data.metadata.lastUpdated,
      oldestLead: sortedLeads[0]?.submittedAt,
      newestLead: sortedLeads[sortedLeads.length - 1]?.submittedAt,
      tagStats,
      statusStats
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    throw new Error('Failed to get storage statistics');
  }
}


