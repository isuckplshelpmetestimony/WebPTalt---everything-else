export const appointmentStatus = {
  confirmed: {
    label: 'Confirmed',
    color: 'cairos-success',
    icon: 'check',
  },
  pending: {
    label: 'Pending',
    color: 'cairos-warning',
    icon: 'clock',
  },
  'checked-in': {
    label: 'Checked In',
    color: 'cairos-primary',
    icon: 'check-circle',
  },
  'no-show': {
    label: 'No Show',
    color: 'cairos-alert',
    icon: 'x',
  },
  canceled: {
    label: 'Canceled',
    color: 'gray',
    icon: 'x-circle',
  },
} as const;



