import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngestClient';
import { readJsonData } from '@/lib/jsonStorage';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    
    const data = await readJsonData();
    
    
    let emailExists = false;
    let leadData = null;
    
    if (data.leads && data.leads.length > 0) {
      const foundLead = data.leads.find(lead => 
        lead.email.toLowerCase() === email.toLowerCase()
      );
      
      if (foundLead) {
        emailExists = true;
        leadData = {
          id: foundLead.id,
          email: foundLead.email,
          tags: foundLead.tags,
        };
      }
    }

    // Send to Inngest workflow 
    await inngest.send({
      name: 'email/process-notification',
      data: {
        email: email,
        emailExists: emailExists,
        leadData: leadData,
        timestamp: new Date().toISOString(),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Email processed and sent to workflow',
      emailExists: emailExists,
      email: email,
      ...(leadData && { leadData })
    });

  } catch (error) {
    console.error('Error processing email check:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}