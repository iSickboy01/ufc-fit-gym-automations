'use server'

import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngestClient';
import { upsertLead } from '@/lib/jsonStorage'; 



interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName : string;
    gymLocation : string;
  }
  
  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        companyName,
        gymLocation
      }: FormData = body;
  
      
      const requiredFields = {
        firstName,
        lastName,
        email,
        phone,
        companyName,
        gymLocation
      };
  
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value || value.trim() === '')
        .map(([key]) => key);
  
      if (missingFields.length > 0) {
        return NextResponse.json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }, { status: 400 });
      }

    // Generate employee_key 
    const employeeKey = 'v' + Math.floor(10000000 + Math.random() * 90000000).toString();
  

    // Upsert lead with employeeKey included
        const savedLead = await upsertLead({
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            email,
            phone,
            address: {
                street: '',
                city: '',
                state: '',
                postalCode: '',
                full: ''
            },
            companyName,
            gymLocation,
            employeeKey,
            submittedAt: new Date().toISOString(),
            source: 'web-form',
        });


    // Send Inngest workflow
    await inngest.send({
      name: 'employee/form.submitted',
      data: {
        leadId: savedLead.id,
        firstName,
        lastName,
        email,
        phone,
        companyName,
        gymLocation,
        employeeKey,
        submittedAt: savedLead.submittedAt,
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead submitted successfully',
        employeeKey: employeeKey
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing gym form submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}