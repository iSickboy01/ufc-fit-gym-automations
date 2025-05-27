import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngestClient'
import { welcomeFlow } from '@/inngest/functions/5daysPass';
import { employeeTagProcessed,  employeeKeyGenerated, employeeForgotKey } from '@/inngest/functions/employeeKey';
import { decisionMakerFlow } from '@/inngest/functions/decisionMakers';

export const { GET, POST, PUT } = serve({
    client: inngest, 
    functions: [welcomeFlow, employeeTagProcessed, employeeKeyGenerated, employeeForgotKey, decisionMakerFlow],
});
