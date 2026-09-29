/**
 * Utility functions for Indian Rupee (INR / ₹) formatting.
 */

export function formatRupeeBudget(budgetStr?: string | null): string {
  if (!budgetStr || budgetStr === 'Not specified' || budgetStr === 'None') {
    return 'Commercial terms requested (INR ₹)';
  }

  // If already contains Rupee symbol or INR keyword, return clean string
  if (budgetStr.includes('₹') || budgetStr.includes('INR') || budgetStr.includes('Rupees') || budgetStr.includes('Lakhs') || budgetStr.includes('Crores')) {
    return budgetStr;
  }

  // Check if contains dollar signs (e.g. "$850,000" or "$500,000 - $1,500,000")
  if (budgetStr.includes('$')) {
    return budgetStr.replace(/\$([\d,]+(?:\.\d+)?)/g, (_, match) => {
      const num = parseFloat(match.replace(/,/g, ''));
      if (isNaN(num)) return `₹${match}`;
      const inrValue = num * 85; // USD to INR conversion rate (~85)
      return formatINR(inrValue);
    });
  }

  // If numeric string
  const cleanNum = parseFloat(budgetStr.replace(/[^\d.]/g, ''));
  if (!isNaN(cleanNum) && cleanNum > 0) {
    return formatINR(cleanNum);
  }

  return `₹ ${budgetStr}`;
}

export function formatINR(val: number): string {
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(2);
    return `₹${val.toLocaleString('en-IN')} (₹${cr} Crores)`;
  }
  if (val >= 100000) {
    const lakhs = (val / 100000).toFixed(2);
    return `₹${val.toLocaleString('en-IN')} (₹${lakhs} Lakhs)`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}
