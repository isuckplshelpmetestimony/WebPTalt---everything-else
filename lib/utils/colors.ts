export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: 'cairos-success',
    expiring: 'cairos-warning',
    expired: 'cairos-alert',
    confirmed: 'cairos-success',
    pending: 'cairos-warning',
    'checked-in': 'cairos-primary',
    'no-show': 'cairos-alert',
    canceled: 'gray',
    draft: 'gray',
    completed: 'cairos-success',
    locked: 'cairos-primary',
  };
  
  return colorMap[status] || 'gray';
}



