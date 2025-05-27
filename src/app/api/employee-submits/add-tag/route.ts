import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngestClient';
import { readJsonData, writeJsonData } from '@/lib/jsonStorage';

export async function POST(request: NextRequest) {
  try {
    // Read all leads from the database
    const data = await readJsonData();
    
    if (!data.leads || data.leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads found in database' },
        { status: 404 }
      );
    }

    const tagsToAdd = ['vemployee', 'employee-added'];
    const updatedLeads = [];
    let leadsModified = 0;

    // Process each lead
    for (let i = 0; i < data.leads.length; i++) {
      const lead = data.leads[i];
      const originalTagCount = lead.tags.length;
      
      // Add the required tags (using Set to prevent duplicates)
      const updatedTags = [...new Set([...lead.tags, ...tagsToAdd])];
      
      // Only update if new tags were actually added
      if (updatedTags.length > originalTagCount) {
        data.leads[i].tags = updatedTags;
        data.leads[i].lastActivityAt = new Date().toISOString();
      }
      
      updatedLeads.push({
        id: lead.id,
        email: lead.email,
        tags: data.leads[i].tags
      });
    }

    // Save the updated data
    await writeJsonData(data);

    // Trigger Inngest workflow with summary data
    await inngest.send({
      name: 'employee/bulk-tags-processed',
      data: {
        timestamp: new Date().toISOString(),
        totalLeads: data.leads.length,
        leadsModified: leadsModified,
        addedTags: tagsToAdd,
        leadIds: updatedLeads.map(lead => lead.id)
      }
    });

    return NextResponse.json({
      success: true,
      message: `Employee tags processed successfully for all leads`,
      totalLeads: data.leads.length,
      leadsModified: leadsModified,
      leadsAlreadyHadTags: data.leads.length - leadsModified,
      addedTags: tagsToAdd,
      updatedLeads: updatedLeads
    });

  } catch (error) {
    console.error('Error processing bulk employee tags:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}