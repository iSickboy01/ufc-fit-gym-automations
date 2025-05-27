import { inngest } from '@/lib/inngestClient';
import { resend } from '@/lib/resend';
import { 
  getLeadById,
  addLeadActivity,
  type LeadData 
} from '@/lib/jsonStorage';
import emailToAllEmployeesHTML from '@/workflow-templates/employee-key-email/emailToAllEmployees';
import eKeyConfirmationEmailHTML from '@/workflow-templates/employee-key-email/eKeyConfirmationEmail';
import eKeyPresentEmailHTML from '@/workflow-templates/employee-key-email/eKeyPresentEmail'; 
import eKeyAbsentEmailHTML from '@/workflow-templates/employee-key-email/eKeyAbsentEmail';   


// In employeeKey.ts, temporarily add:
console.log('eKeyConfirmationEmailHTML:', eKeyConfirmationEmailHTML);
console.log('typeof eKeyConfirmationEmailHTML:', typeof eKeyConfirmationEmailHTML);

// Employee tag processing workflow
export const employeeTagProcessed = inngest.createFunction(
    { id: 'employee-tag-processed' },
    { event: 'employee/bulk-tags-processed' },
    async ({ event, step }) => {
      const { leadIds, totalLeads, leadsModified, timestamp } = event.data;
  
      // Step 1: Log the bulk processing
      await step.run('log-bulk-processing', async () => {
        console.log(`Processing employee tags for ${totalLeads} leads:`, {
          leadsModified,
          timestamp,
          leadIds: leadIds.slice(0, 5) // Log first 5 IDs to avoid clutter
        });
      });
  
      // Step 2: Send employee key generation emails
      await step.run('send-employee-key-emails', async () => {
        const emailResults = [];
        
        for (const leadId of leadIds) {
          try {
            // Get the lead details
            const lead = await getLeadById(leadId);
            
            if (lead && lead.email) {
              // Generate the employee key generation link
              const employeeKeyUrl = `http://localhost:3000/employee-key-generation?leadId=${leadId}`;
              
              // Send the email using your template
              const emailResult = await resend.emails.send({
                from: 'onboarding@resend.dev', // Use your sender email
                to: lead.email,
                subject: 'Generate Your Employee Access Key',
                html: emailToAllEmployeesHTML(lead.firstName || lead.fullName || 'Team Member', employeeKeyUrl),
              });
  
              // Log the activity
              await addLeadActivity(leadId, {
                type: 'employee_key_email_sent',
                description: 'Employee key generation email sent',
                timestamp: new Date().toISOString(),
                metadata: { 
                  emailId: emailResult.data?.id,
                  subject: 'Generate Your Employee Access Key',
                  template: 'employee-key',
                  recipientEmail: lead.email,
                  employeeKeyUrl: employeeKeyUrl
                }
              });
              
              emailResults.push({
                leadId,
                email: lead.email,
                success: true,
                messageId: emailResult.data?.id
              });
              
              console.log(`Employee key email sent to ${lead.email} for lead ${leadId}`);
              
            } else {
              console.warn(`No email found for lead ${leadId}`);
              emailResults.push({
                leadId,
                success: false,
                error: 'No email address found'
              });
  
              // Log the failed attempt
              await addLeadActivity(leadId, {
                type: 'employee_key_email_failed',
                description: 'Failed to send employee key email - no email address',
                timestamp: new Date().toISOString(),
                metadata: { 
                  error: 'No email address found',
                  leadId
                }
              });
            }
          } catch (error) {
            console.error(`Failed to send employee key email for lead ${leadId}:`, error);
            
            emailResults.push({
              leadId,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
  
            // Log the error
            try {
              await addLeadActivity(leadId, {
                type: 'employee_key_email_failed',
                description: 'Failed to send employee key email',
                timestamp: new Date().toISOString(),
                metadata: { 
                  error: error instanceof Error ? error.message : 'Unknown error',
                  leadId
                }
              });
            } catch (activityError) {
              console.error(`Failed to log activity for lead ${leadId}:`, activityError);
            }
          }
        }
  
        const successCount = emailResults.filter(result => result.success).length;
        const failureCount = emailResults.filter(result => !result.success).length;
  
        console.log(`Employee key emails sent: ${successCount} successful, ${failureCount} failed`);
        
        return {
          totalEmails: emailResults.length,
          successful: successCount,
          failed: failureCount,
          results: emailResults
        };
      });
  
      // Step 3: Final completion logging
      await step.run('complete-employee-processing', async () => {
        console.log(`Employee key email workflow completed for ${totalLeads} leads`);
        
        return {
          workflowId: 'employee-tag-processed',
          completedAt: new Date().toISOString(),
          totalLeads,
          leadsModified
        };
      });
  
      return {
        success: true,
        totalLeads,
        leadsModified,
        processedAt: new Date().toISOString()
      };
    }
  );
  
  // Employee Key Generated Confirmation Workflow
  export const employeeKeyGenerated = inngest.createFunction(
    { id: 'employee-key-generated' },
    { event: 'employee/form.submitted' },
    async ({ event, step }) => {
      const { leadId, email, employeeKey, timestamp } = event.data;
  
      await step.run('log-key-generation', async () => {
        console.log(`Employee key generated for lead ${leadId}:`, {
          email,
          timestamp,
          keyGenerated: !!employeeKey
        });
      });
  
      await step.run('send-confirmation-email', async () => {
        try {
          // Get the lead details
          const lead = await getLeadById(leadId);
          
          if (lead && lead.email) {
            // Send confirmation email
            const emailResult = await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: lead.email,
              subject: 'Your Employee Key Has Been Generated!',
              html: eKeyConfirmationEmailHTML(lead.firstName || lead.fullName || 'Team Member', employeeKey),
            });
  
            // Log the activity
            await addLeadActivity(leadId, {
              type: 'employee_key_confirmation_sent',
              description: 'Employee key confirmation email sent',
              timestamp: new Date().toISOString(),
              metadata: { 
                emailId: emailResult.data?.id,
                subject: 'Your Employee Key Has Been Generated!',
                template: 'employee-confirmation',
                recipientEmail: lead.email,
                employeeKey: employeeKey
              }
            });
  
            console.log(`Employee key confirmation email sent to ${lead.email}`);
            
            return {
              success: true,
              emailSent: true,
              messageId: emailResult.data?.id
            };
          } else {
            console.warn(`No lead found for leadId: ${leadId}`);
            return {
              success: false,
              error: 'Lead not found'
            };
          }
        } catch (error) {
          console.error(`Failed to send employee key confirmation email:`, error);
          
          // Log the error
          try {
            await addLeadActivity(leadId, {
              type: 'employee_key_confirmation_failed',
              description: 'Failed to send employee key confirmation email',
              timestamp: new Date().toISOString(),
              metadata: { 
                error: error instanceof Error ? error.message : 'Unknown error',
                leadId
              }
            });
          } catch (activityError) {
            console.error(`Failed to log activity for lead ${leadId}:`, activityError);
          }
  
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });
  
      return {
        success: true,
        leadId,
        email,
        processedAt: new Date().toISOString()
      };
    }
  );
  
  // Employee Forgot Key Workflow
  export const employeeForgotKey = inngest.createFunction(
    { id: 'employee-forgot-key' },
    { event: 'email/process-notification' },
    async ({ event, step }) => {
      const { email, emailExists, leadData, timestamp } = event.data;
  
      await step.run('log-forgot-key-request', async () => {
        console.log(`Employee forgot key request for email ${email}:`, {
          emailExists,
          timestamp,
          hasLeadData: !!leadData
        });
      });
  
      await step.run('send-forgot-key-email', async () => {
        try {
          let emailResult;
          let firstName = 'Team Member';
          
          // If email exists, get the lead's name
          if (emailExists && leadData) {
            const lead = await getLeadById(leadData.id);
            if (lead) {
              firstName = lead.firstName || lead.fullName || 'Team Member';
            }
          }
  
          if (emailExists) {
            // Send "key present" email
            emailResult = await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: email,
              subject: 'Your Employee Key Recovery',
              html: eKeyPresentEmailHTML(firstName),
            });
  
            // Log activity 
            if (leadData) {
              await addLeadActivity(leadData.id, {
                type: 'employee_key_recovery_sent',
                description: 'Employee key recovery email sent - key found',
                timestamp: new Date().toISOString(),
                metadata: { 
                  emailId: emailResult.data?.id,
                  subject: 'Your Employee Key Recovery',
                  template: 'key-present',
                  recipientEmail: email,
                  keyFound: true
                }
              });
            }
            
  
            console.log(`Employee key recovery email (key found) sent to ${email}`);
          } else {
            // Send "key absent" email
            emailResult = await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: email,
              subject: 'Employee Key Not Found',
              html: eKeyAbsentEmailHTML(firstName),
            });
  
            console.log(`Employee key recovery email (key not found) sent to ${email}`);
          }
  
          return {
            success: true,
            emailSent: true,
            emailExists,
            messageId: emailResult.data?.id,
            templateUsed: emailExists ? 'key-present' : 'key-absent'
          };
  
        } catch (error) {
          console.error(`Failed to send employee forgot key email to ${email}:`, error);
          
          // Log the error if we have lead data
          if (emailExists && leadData) {
            try {
              await addLeadActivity(leadData.id, {
                type: 'employee_key_recovery_failed',
                description: 'Failed to send employee key recovery email',
                timestamp: new Date().toISOString(),
                metadata: { 
                  error: error instanceof Error ? error.message : 'Unknown error',
                  recipientEmail: email
                }
              });
            } catch (activityError) {
              console.error(`Failed to log activity for lead ${leadData.id}:`, activityError);
            }
          }
  
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });
  
      return {
        success: true,
        email,
        emailExists,
        processedAt: new Date().toISOString()
      };
    }
  );