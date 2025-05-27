import { inngest } from '@/lib/inngestClient';
import { resend } from '@/lib/resend';
import { twilio } from '@/lib/twilio';
import { 
  getLeadsByEmail, 
  updateLeadTags, 
  addLeadActivity,
  type LeadData 
} from '@/lib/jsonStorage';
import firstReminderEmailHTML from '@/workflow-templates/welcome-email/firstreminderEmail';
import secRemEmailHTML from '@/workflow-templates/welcome-email/secondRemEmail';
import teamNotificationEmailHTML from '@/workflow-templates/welcome-email/teamNotificationEmail';
import thirdReminderEmailHTML from '@/workflow-templates/welcome-email/thirdreminderEmail copy';
import fourthReminderEmailHTML from '@/workflow-templates/welcome-email/fourthreminderEmail';
import getWelcomeEmailHTML from '@/workflow-templates/welcome-email/welcomeEmail';
import teamNotificationSMS from '@/workflow-templates/welcome-sms/teamNotificationSMS';
import getWelcomeSMS from '@/workflow-templates/welcome-sms/welcomeSMS';

console.log('=== IMPORT DEBUG ===');
console.log('firstReminderEmailHTML:', {
  type: typeof firstReminderEmailHTML,
  value: firstReminderEmailHTML,
  isFunction: typeof firstReminderEmailHTML === 'function',
  keys: Object.keys(firstReminderEmailHTML || {}),
  stringified: JSON.stringify(firstReminderEmailHTML, null, 2)?.substring(0, 200)
});

console.log('secRemEmailHTML:', {
  type: typeof secRemEmailHTML,
  value: secRemEmailHTML,
  isFunction: typeof secRemEmailHTML === 'function',
  keys: Object.keys(secRemEmailHTML || {}),
  stringified: JSON.stringify(secRemEmailHTML, null, 2)?.substring(0, 200)
});

console.log('thirdReminderEmailHTML:', {
  type: typeof thirdReminderEmailHTML,
  value: thirdReminderEmailHTML,
  isFunction: typeof thirdReminderEmailHTML === 'function',
  keys: Object.keys(thirdReminderEmailHTML || {}),
  stringified: JSON.stringify(thirdReminderEmailHTML, null, 2)?.substring(0, 200)
});

console.log('fourthReminderEmailHTML:', {
  type: typeof fourthReminderEmailHTML,
  value: fourthReminderEmailHTML,
  isFunction: typeof fourthReminderEmailHTML === 'function',
  keys: Object.keys(fourthReminderEmailHTML || {}),
  stringified: JSON.stringify(fourthReminderEmailHTML, null, 2)?.substring(0, 200)
});

export const welcomeFlow = inngest.createFunction(
  { id: 'welcome-flow' },
  { event: 'app/lead.submitted' },
  async ({ event, step }) => {
    const { firstName, lastName, fullName, email, phone, address, full } = event.data;
    
    // Get the lead from storage
    const leads = await step.run('get-lead-data', async () => {
      const leadData = await getLeadsByEmail(email);
      if (leadData.length === 0) {
        throw new Error(`Lead not found for email: ${email}`);
      }
      return leadData[0]; // Get the most recent lead with this email
    });

    const leadId = leads.id;

    // Add initial tag to contact
    await step.run('add-tag-5days-pass', async () => {
      await updateLeadTags(leadId, ['5days-pass']);
      await addLeadActivity(leadId, {
        type: 'tag_added',
        description: 'Added "5days-pass" tag',
        timestamp: new Date().toISOString(),
        metadata: { tag: '5days-pass' }
      });
      console.log(`Tagged ${email} with '5days-pass'`);
    });

    // Wait 1 minute
    await step.sleep('wait-1-minute', '1m');

    // Send to Google Sheets 
    await step.run('send-to-google-sheets', async () => {
      await addLeadActivity(leadId, {
        type: 'google_sheets_sync',
        description: 'Lead data synced to Google Sheets',
        timestamp: new Date().toISOString(),
        metadata: { 
          action: 'sync',
          fullName,
          email,
          phone 
        }
      });
      console.log(`Sending ${fullName} to Google Sheets`);
      
    });

    // Send welcome email
    await step.run('send-welcome-email', async () => {
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your 5 Day Free Gym Pass is HERE!',
        html: getWelcomeEmailHTML(firstName),
      });

      await addLeadActivity(leadId, {
        type: 'email_sent',
        description: 'Welcome email sent',
        timestamp: new Date().toISOString(),
        metadata: { 
          emailId: emailResult.data?.id,
          subject: 'Your 5 Day Free Gym Pass is HERE!',
          template: 'welcome'
        }
      });
    });

    // Send welcome SMS
    await step.run('send-welcome-sms', async () => {
      const smsResult = await twilio.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: phone,
        body: getWelcomeSMS(firstName),
      });

      await addLeadActivity(leadId, {
        type: 'sms_sent',
        description: 'Welcome SMS sent',
        timestamp: new Date().toISOString(),
        metadata: { 
          messageId: smsResult.sid,
          template: 'welcome'
        }
      });
    });

    // Notify team (email)
    await step.run('notify-team-email', async () => {
      const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL || 'doctorsimpsonswag@gmail.com';
      
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: teamEmail,
        subject: 'New Lead Submitted',
        html: teamNotificationEmailHTML(fullName, phone, email, full),
      });

      await addLeadActivity(leadId, {
        type: 'team_notification',
        description: 'Team notification email sent',
        timestamp: new Date().toISOString(),
        metadata: { 
          notificationType: 'email',
          teamEmail
        }
      });
    });

    // Notify team (SMS)
    await step.run('notify-team-sms', async () => {
      const teamPhone = process.env.TEAM_PHONE_NUMBER;
      
      if (teamPhone) {
        await twilio.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: teamPhone,
          body: teamNotificationSMS(firstName),
        });

        await addLeadActivity(leadId, {
          type: 'team_notification',
          description: 'Team notification SMS sent',
          timestamp: new Date().toISOString(),
          metadata: { 
            notificationType: 'sms',
            teamPhone
          }
        });
      }
    });

    // App notification 
    await step.run('app-notification', async () => {
      await addLeadActivity(leadId, {
        type: 'app_notification',
        description: 'In-app notification triggered',
        timestamp: new Date().toISOString(),
        metadata: { 
          leadName: firstName,
          status: 'new_lead'
        }
      });
      console.log(`Sending in-app notification for ${firstName}`);
    });

// reminder emails configuration section
const processReminders = async () => {
  
  const templateValidation = [
    { name: 'firstReminderEmailHTML', fn: firstReminderEmailHTML },
    { name: 'fourthReminderEmailHTML', fn: fourthReminderEmailHTML },
    { name: 'thirdReminderEmailHTML', fn: thirdReminderEmailHTML }
  ];

  // Check if any templates are missing or invalid
  const invalidTemplates = templateValidation.filter(
    template => typeof template.fn !== 'function'
  );

  if (invalidTemplates.length > 0) {
    const invalidNames = invalidTemplates.map(t => t.name).join(', ');
    throw new Error(`Invalid email templates: ${invalidNames}. Expected functions but got: ${invalidTemplates.map(t => typeof t.fn).join(', ')}`);
  }

  const reminderConfigs = [
    {
      templateFn: firstReminderEmailHTML,
      subject: "Don't Miss Out! Activate Your UFC Fit 5-Day Pass",
      wait: '2m',
      tag: 'reminder-1-sent',
      reminderNumber: 1
    },
    {
      templateFn: fourthReminderEmailHTML,
      subject: 'Last Chance to Use Your 5-Day UFC Fit Test',
      wait: '4m', 
      tag: 'reminder-2-sent',
      reminderNumber: 2
    },
    {
      templateFn: thirdReminderEmailHTML,
      subject: 'Last Chance to Use Your 5-Day UFC Fit Pass!',
      wait: '7m',
      tag: 'reminder-3-sent',
      reminderNumber: 3
    }
  ];

  for (const config of reminderConfigs) {
    const { templateFn, subject, wait, tag, reminderNumber } = config;

  
    const clicked = await step.waitForEvent(
      `wait-for-digital-pass-${reminderNumber}`,
      {
        event: 'crm/digital-pass-clicked',
        timeout: wait,
      }
    );

    // If user clicked, tag them and exit the loop
    if (clicked) {
      await step.run(`tag-pass-saved-${reminderNumber}`, async () => {
        await updateLeadTags(leadId, ['digital-pass-saved'], 'add');
        await addLeadActivity(leadId, {
          type: 'digital_pass_clicked',
          description: 'Digital pass was clicked',
          timestamp: new Date().toISOString(),
          metadata: { 
            reminderRound: reminderNumber,
            clickedAt: clicked.data?.timestamp || new Date().toISOString()
          }
        });
        console.log(`Tagged ${email} with 'digital-pass-saved' after reminder ${reminderNumber}`);
      });
      break; 
    }

    // User didn't click, send the next reminder
    await step.run(`send-reminder-email-${reminderNumber}`, async () => {
      try {
        
        const html = templateFn(firstName);
        
        const emailResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject,
          html,
        });

        await updateLeadTags(leadId, [tag], 'add');
        
        // Log activity
        await addLeadActivity(leadId, {
          type: 'reminder_email_sent',
          description: `Reminder email ${reminderNumber} sent`,
          timestamp: new Date().toISOString(),
          metadata: { 
            emailId: emailResult.data?.id,
            reminderNumber,
            subject,
            template: `reminder-${reminderNumber}`,
            recipientEmail: email
          }
        });

        console.log(`Sent reminder ${reminderNumber} to ${email}: ${subject}`);
      } catch (error) {
        console.error(`Failed to send reminder ${reminderNumber} to ${email}:`, error);
        
        await addLeadActivity(leadId, {
          type: 'reminder_email_failed',
          description: `Failed to send reminder email ${reminderNumber}`,
          timestamp: new Date().toISOString(),
          metadata: { 
            reminderNumber,
            error: error instanceof Error ? error.message : 'Unknown error',
            recipientEmail: email
          }
        });
        
      }
    });
  }
};

await processReminders();

    // Final workflow completion tracking
    await step.run('complete-workflow', async () => {
      await updateLeadTags(leadId, ['workflow-completed'], 'add');
      await addLeadActivity(leadId, {
        type: 'workflow_completed',
        description: 'Welcome workflow completed',
        timestamp: new Date().toISOString(),
        metadata: { 
          workflowId: 'welcome-flow',
          completedAt: new Date().toISOString()
        }
      });
      console.log(`Workflow completed for ${email}`);
    });
  }
);