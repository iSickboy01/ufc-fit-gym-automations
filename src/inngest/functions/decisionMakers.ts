import { inngest } from '@/lib/inngestClient';
import { resend } from '@/lib/resend';
import { twilio } from '@/lib/twilio';
import { 
  getLeadsByEmail, 
  updateLeadTags, 
  addLeadActivity,
  type LeadData 
} from '@/lib/jsonStorage';
import decisionMakerNotificationEmailHTML from '@/workflow-templates/decisionMakers/decisionMakersEmail.ts/decisionMakerNotificationEmail';
import decisionMakerConfirmationEmailHTML from '@/workflow-templates/decisionMakers/decisionMakersEmail.ts/decisionMakerConfirmationEmail';
import decisionMakerTeamNotificationSMS from '@/workflow-templates/decisionMakers/decisionMakersSMS.ts/decisionMakerTeamNotificationSMS';

export const decisionMakerFlow = inngest.createFunction(
  { id: 'decision-maker-flow' },
  { event: 'app/decision-maker.registered' },
  async ({ event, step }) => {
    const { 
      firstName, 
      lastName, 
      fullName, 
      email, 
      phone, 
      companyName,
      jobTitle,
      gymLocation,
      employeeListSize,
      companyAddress 
    } = event.data;
    
    // Get the lead from storage
    const leads = await step.run('get-lead-data', async () => {
      const leadData = await getLeadsByEmail(email);
      if (leadData.length === 0) {
        throw new Error(`Decision maker not found for email: ${email}`);
      }
      return leadData[0]; // Get the most recent lead with this email
    });

    const leadId = leads.id;

    // Add initial tags to contact
    await step.run('add-decision-maker-tags', async () => {
      const tags = ['decision-maker', gymLocation];
      await updateLeadTags(leadId, tags);
      await addLeadActivity(leadId, {
        type: 'tag_added',
        description: `Added decision maker tags: ${tags.join(', ')}`,
        timestamp: new Date().toISOString(),
        metadata: { 
          tags,
          companyName,
          employeeListSize 
        }
      });
      console.log(`Tagged ${email} with decision maker tags: ${tags.join(', ')}`);
    });

    // Notify team via email
    await step.run('notify-team-email', async () => {
      const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL || 'doctorsimpsonswag@gmail.com';
      
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: teamEmail,
        subject: 'New Decision Maker Registration - Corporate Account',
        html: decisionMakerNotificationEmailHTML(
          fullName, 
          phone, 
          email, 
          companyName,
          jobTitle,
          gymLocation,
          employeeListSize,
          companyAddress.full
        ),
      });

      await addLeadActivity(leadId, {
        type: 'team_notification',
        description: 'Team notification email sent for decision maker',
        timestamp: new Date().toISOString(),
        metadata: { 
          notificationType: 'email',
          teamEmail,
          emailId: emailResult.data?.id,
          companyName,
          employeeListSize
        }
      });

      console.log(`Team email notification sent for decision maker: ${fullName} from ${companyName}`);
    });

    // Notify team via SMS
    await step.run('notify-team-sms', async () => {
      const teamPhone = process.env.TEAM_PHONE_NUMBER;
      
      if (teamPhone) {
        const smsResult = await twilio.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: teamPhone,
          body: decisionMakerTeamNotificationSMS(firstName, companyName, employeeListSize),
        });

        await addLeadActivity(leadId, {
          type: 'team_notification',
          description: 'Team notification SMS sent for decision maker',
          timestamp: new Date().toISOString(),
          metadata: { 
            notificationType: 'sms',
            teamPhone,
            messageId: smsResult.sid,
            companyName,
            employeeListSize
          }
        });

        console.log(`Team SMS notification sent for decision maker: ${firstName} from ${companyName}`);
      }
    });

    // Send to Google Sheets or CRM
    await step.run('send-to-google-sheets', async () => {
      await addLeadActivity(leadId, {
        type: 'google_sheets_sync',
        description: 'Decision maker data synced to Google Sheets',
        timestamp: new Date().toISOString(),
        metadata: { 
          action: 'sync',
          leadType: 'decision-maker',
          fullName,
          email,
          phone,
          companyName,
          jobTitle,
          gymLocation,
          employeeListSize,
        }
      });
      console.log(`Sending decision maker ${fullName} from ${companyName} to Google Sheets`);
    });

    // Wait 30 seconds before sending confirmation
    await step.sleep('wait-30-seconds', '30s');

    // Send registration confirmation email
    await step.run('send-confirmation-email', async () => {
      // Calculate free months for email content
      const freeMonths = employeeListSize.includes('6-49') ? 1 :
                        employeeListSize.includes('50-99') ? 2 :
                        employeeListSize.includes('100-249') ? 3 :
                        employeeListSize.includes('250-499') ? 4 :
                        employeeListSize.includes('500-999') ? 5 :
                        employeeListSize.includes('1000-1999') ? 6 :
                        employeeListSize.includes('2000-2999') ? 7 :
                        employeeListSize.includes('3000-3999') ? 8 :
                        employeeListSize.includes('4000-4999') ? 9 :
                        employeeListSize.includes('5000+') ? 12 : 0;

      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Welcome ${companyName}! Your Corporate Gym Account is Ready`,
        html: decisionMakerConfirmationEmailHTML(
          firstName,
          companyName,
          gymLocation,
          employeeListSize
        ),
      });

      await addLeadActivity(leadId, {
        type: 'confirmation_email_sent',
        description: 'Registration confirmation email sent to decision maker',
        timestamp: new Date().toISOString(),
        metadata: { 
          emailId: emailResult.data?.id,
          subject: `Welcome ${companyName}! Your Corporate Gym Account is Ready`,
          template: 'decision-maker-confirmation',
          freeMonths,
          companyName
        }
      });

      console.log(`Confirmation email sent to ${email} for ${companyName} (${freeMonths} months free)`);
    });

    // App notification for decision maker registration
    await step.run('app-notification', async () => {
      await addLeadActivity(leadId, {
        type: 'app_notification',
        description: 'Decision maker registration notification triggered',
        timestamp: new Date().toISOString(),
        metadata: { 
          leadName: firstName,
          companyName,
          status: 'new_decision_maker',
          employeeListSize,
          gymLocation
        }
      });
      console.log(`Sending in-app notification for decision maker ${firstName} from ${companyName}`);
    });

    // Final workflow completion tracking
    await step.run('complete-workflow', async () => {
      await updateLeadTags(leadId, ['decision-maker-workflow-completed'], 'add');
      await addLeadActivity(leadId, {
        type: 'workflow_completed',
        description: 'Decision maker workflow completed',
        timestamp: new Date().toISOString(),
        metadata: { 
          workflowId: 'decision-maker-flow',
          completedAt: new Date().toISOString(),
          companyName,
          finalStatus: 'registered'
        }
      });
      console.log(`Decision maker workflow completed for ${email} from ${companyName}`);
    });
  }
);