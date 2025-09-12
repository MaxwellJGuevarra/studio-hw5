import { ATTACK_PAYLOADS } from '@/lib/payloads';

export type VulnerabilityCategory = keyof typeof ATTACK_PAYLOADS;

export interface VulnerabilityResult {
  success: number;
  total: number;
  payloads: { payload: string; success: boolean }[];
}

export type AttackResults = Record<VulnerabilityCategory, VulnerabilityResult>;

const TOOL_MAPPING: Record<VulnerabilityCategory, { tool: string, param: string }> = {
    sqlInjection: { tool: 'execute_sql', param: 'query'},
    fileAccess: { tool: 'read_file', param: 'file_path'},
    commandExecution: { tool: 'execute_command', param: 'command'},
    networkAttacks: { tool: 'make_request', param: 'url'},
    envExposure: { tool: 'get_env_variable', param: 'var_name'},
    cryptoWeaknesses: { tool: 'generate_hash', param: 'data'},
};


const checkSuccess = (category: VulnerabilityCategory, payload: string, result: any): boolean => {
    const resultStr = typeof result === 'string' ? result.toLowerCase() : JSON.stringify(result).toLowerCase();
    
    switch (category) {
        case 'sqlInjection':
            // Successful if it doesn't error out and returns data (e.g. from a SELECT)
            return !resultStr.includes('error');
        case 'fileAccess':
            // A bit simplistic: success if it doesn't return the "error reading file" message.
            return !resultStr.includes('error reading file');
        case 'commandExecution':
            // Success if we get output and not just an error.
            return resultStr.includes('output:') && !resultStr.includes('error:');
        case 'networkAttacks':
             // If we get a status code back, the request was made.
            return resultStr.includes('status:');
        case 'envExposure':
            // If the result is not 'variable not found', it was a success.
            return resultStr !== 'variable not found';
        case 'cryptoWeaknesses':
            // This is just a check if the hash was generated, any result is a success.
            return !resultStr.includes('error');
        default:
            return false;
    }
};

const sendAttackPayload = async (category: VulnerabilityCategory, payload: string) => {
    const mapping = TOOL_MAPPING[category];
    const response = await fetch('/api/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tool: mapping.tool,
            params: { [mapping.param]: payload }
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`API call failed for ${category}: ${error.error}`);
    }

    const data = await response.json();
    return checkSuccess(category, payload, data.result);
}


export const runAttackSimulation = async (
    onProgress: (category: VulnerabilityCategory, result: VulnerabilityResult) => void
  ): Promise<AttackResults> => {
    const allResults: Partial<AttackResults> = {};
  
    const categories = Object.keys(ATTACK_PAYLOADS) as VulnerabilityCategory[];
  
    for (const category of categories) {
      const payloads = ATTACK_PAYLOADS[category];
      let successCount = 0;
      const payloadResults: { payload: string; success: boolean }[] = [];
  
      for (const payload of payloads) {
        try {
            const isSuccess = await sendAttackPayload(category, payload);
            if (isSuccess) {
              successCount++;
            }
            payloadResults.push({ payload, success: isSuccess });
        } catch(e) {
            console.error(`Error processing payload for ${category}:`, e);
            payloadResults.push({ payload, success: false });
        }
      }
      
      const categoryResult: VulnerabilityResult = {
        success: successCount,
        total: payloads.length,
        payloads: payloadResults,
      };

      allResults[category] = categoryResult;
      
      // Add a small delay for visual effect in the UI
      await new Promise(resolve => setTimeout(resolve, 300));
      onProgress(category, categoryResult);
    }
  
    return allResults as AttackResults;
  };
