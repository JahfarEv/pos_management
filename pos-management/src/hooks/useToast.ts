// hooks/useToast.ts
import { toast } from 'sonner';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  };

  const showError = (message: string) => {
    // Check for specific error patterns
    if (message.includes('out of stock')) {
      toast.error(message, {
        duration: 5000,
        icon: '⚠️',
        action: {
          label: 'View Stock',
          onClick: () => {
            // Navigate to stock page or open stock modal
            console.log('View stock clicked');
          },
        },
      });
    } else if (message.includes('stock')) {
      toast.error(message, {
        duration: 4000,
        icon: '📦',
      });
    } else {
      toast.error(message, {
        duration: 4000,
      });
    }
  };

  const showWarning = (message: string) => {
    toast.warning(message, {
      duration: 4000,
    });
  };

  const showInfo = (message: string) => {
    toast.info(message, {
      duration: 3000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};