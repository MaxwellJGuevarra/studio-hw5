import { ATTACK_PAYLOADS } from '@/lib/payloads';

export type VulnerabilityCategory = keyof typeof ATTACK_PAYLOADS;

export interface VulnerabilityResult {
  success: number;
  total: number;
  payloads: { payload: string; success: boolean }[];
}

export type AttackResults = Record<VulnerabilityCategory, VulnerabilityResult>;

const simulatePayload = (category: VulnerabilityCategory, payload: string): boolean => {
  // Simple simulation logic based on payload content to determine "success"
  switch (category) {
    case 'sqlInjection':
      return /'|;|--|OR|UNION|DROP/i.test(payload);
    case 'fileAccess':
      return /\.\.\/|\.\.\\/.test(payload);
    case 'commandExecution':
      // Exclude URLs to avoid overlap with SSRF payloads
      return /;|&&?|\|\|?|`/.test(payload) && !payload.startsWith('http');
    case 'networkAttacks':
      return /localhost|169\.254\.169\.254|file:\/\//i.test(payload);
    case 'envExposure':
      // Any attempt to access an env var is a "success" in this simulation
      return true;
    case 'cryptoWeaknesses':
      return ['md5', 'sha1'].includes(payload.toLowerCase());
    default:
      return false;
  }
};

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
        const isSuccess = simulatePayload(category, payload);
        if (isSuccess) {
          successCount++;
        }
        payloadResults.push({ payload, success: isSuccess });
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
