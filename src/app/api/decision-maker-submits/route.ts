'use server'

import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngestClient';
import { upsertLead } from '@/lib/jsonStorage'; 

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  gymLocation: string;
  employeeListSize: string;
  companyAddress: string;
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
      password,
      phone, 
      companyName,
      jobTitle,
      gymLocation,
      employeeListSize,
      companyAddress, 
      city, 
      state, 
      postalCode 
    }: FormData = body;

    // Validate required fields
    const requiredFields = {
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName,
      jobTitle,
      gymLocation,
      employeeListSize,
      city,
      state,
      postalCode,
      companyAddress,
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
        street: '',
        city: '',
        state: '',
        postalCode: '',
        full: ''
      },
      companyAddress: {
        street: companyAddress,
        city,
        state,
        postalCode,
        full: `${companyAddress}, ${city}, ${state} ${postalCode}`
      },
      submittedAt: new Date().toISOString(),
      source: 'decision-maker-form',
      companyName,
      jobTitle,
      gymLocation,
      employeeListSize,
      employeeKey: '',
      hasPassword: true 
    });

    // Send Inngest event
    await inngest.send({
      name: 'app/decision-maker.registered',
      data: {
        leadId: savedLead.id, 
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        companyName,
        employeeKey: '',
        jobTitle,
        gymLocation,
        employeeListSize,
        companyAddress,
        submittedAt: savedLead.submittedAt,
      },
    });

    return NextResponse.json({ 
      message: 'Decision maker registration completed successfully',
      leadId: savedLead.id,
      freeMonths: employeeListSize.includes('6-49') ? 1 :
                  employeeListSize.includes('50-99') ? 2 :
                  employeeListSize.includes('100-249') ? 3 :
                  employeeListSize.includes('250-499') ? 4 :
                  employeeListSize.includes('500-999') ? 5 :
                  employeeListSize.includes('1000-1999') ? 6 :
                  employeeListSize.includes('2000-2999') ? 7 :
                  employeeListSize.includes('3000-3999') ? 8 :
                  employeeListSize.includes('4000-4999') ? 9 :
                  employeeListSize.includes('5000+') ? 12 : 0
    });
  } catch (error) {
    console.error('Error processing decision maker registration:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}