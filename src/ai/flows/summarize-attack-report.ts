// Summarize the attack report and provides actionable insights.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttackReportSchema = z.object({
    overallSuccessRate: z.string().describe('The overall success rate of the attacks.'),
    sqlInjectionRate: z.string().describe('The success rate of SQL injection attacks.'),
    fileAccessRate: z.string().describe('The success rate of file access attacks.'),
    commandExecutionRate: z.string().describe('The success rate of command execution attacks.'),
    networkAttacksRate: z.string().describe('The success rate of network attacks.'),
    cryptoWeaknessesRate: z.string().describe('The success rate of crypto weaknesses attacks.'),
});

export type AttackReport = z.infer<typeof AttackReportSchema>;

const SummaryOutputSchema = z.object({
    summary: z.string().describe('A concise summary of the attack report.'),
    actionableInsights: z.string().describe('Actionable insights for remediation.'),
});

export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

export async function summarizeAttackReport(report: AttackReport): Promise<SummaryOutput> {
    return summarizeAttackReportFlow(report);
}

const prompt = ai.definePrompt({
    name: 'summarizeAttackReportPrompt',
    input: {schema: AttackReportSchema},
    output: {schema: SummaryOutputSchema},
    prompt: `You are a security expert. Given the following attack report, provide a concise summary of the key findings and actionable insights for remediation.

Attack Report:
Overall Success Rate: {{{overallSuccessRate}}}
SQL Injection Rate: {{{sqlInjectionRate}}}
File Access Rate: {{{fileAccessRate}}}
Command Execution Rate: {{{commandExecutionRate}}}
Network Attacks Rate: {{{networkAttacksRate}}}
Crypto Weaknesses Rate: {{{cryptoWeaknessesRate}}}

Summary:
Actionable Insights: `,
});

const summarizeAttackReportFlow = ai.defineFlow(
    {
        name: 'summarizeAttackReportFlow',
        inputSchema: AttackReportSchema,
        outputSchema: SummaryOutputSchema,
    },
    async (report) => {
        const {output} = await prompt(report);
        return output!;
    }
);
