'use server'

import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngestClient';
import { upsertLead } from '@/lib/jsonStorage'; 

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      postalCode 
    }: FormData = body;

    // Validate required fields
    const requiredFields = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Upsert lead (create new or update existing)
    const savedLead = await upsertLead({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      phone,
      address: {
        street: address,
        city,
        state,
        postalCode,
        full: `${address}, ${city}, ${state} ${postalCode}`
      },
      submittedAt: new Date().toISOString(),
      source: 'web-form',
      companyName: '',
      gymLocation: '',
      employeeKey: ''
    });


   
    await inngest.send({
      name: 'app/lead.submitted',
      data: {
        leadId: savedLead.id, 
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        address: {
          street: address,
          city,
          state,
          postalCode,
          full: `${address}, ${city}, ${state} ${postalCode}`
        },
        submittedAt: savedLead.submittedAt,
      },
    });

    return NextResponse.json({ 
      message: 'Contact information submitted successfully',
      leadId: savedLead.id
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}