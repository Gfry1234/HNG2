import { LivenessCheckResult } from '@/types';
import { StorageService } from './storageService';

export const LivenessService = {
  // was tryna Simulate facial liveness detection
  // In a real app, this would use a facial recognition library
  async checkFacialLiveness(userId: string): Promise<LivenessCheckResult> {
    try {
      // also i used this to Simulate liveness check with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // same as this to Simulate random success (90% success rate for demo)
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        await StorageService.setLivenessVerified(userId);

        return {
          success: true,
          userId,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Face not detected. Please try again.',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        timestamp: new Date().toISOString(),
        error: error?.message || 'Liveness check failed',
      };
    }
  },

  // Get liveness check status
  async getLivenessStatus(): Promise<boolean> {
    try {
      return await StorageService.isLivenessVerified();
    } catch (error) {
      console.error('Error getting liveness status:', error);
      return false;
    }
  },

  // Clear liveness verification
  async clearVerification(): Promise<void> {
    try {
      await StorageService.clearLivenessVerification();
    } catch (error) {
      console.error('Error clearing liveness verification:', error);
      throw error;
    }
  },

  // Get verification instructions
  getInstructions(): string[] {
    return [
      'Ensure adequate lighting',
      'Face the camera directly',
      'Keep your head still',
      'Avoid excessive movement',
      'Look at the camera for 3-5 seconds',
    ];
  },

  // Get error recovery suggestions
  getRecoverySuggestions(error?: string): string[] {
    if (error?.includes('Face not detected')) {
      return [
        'Move closer to the camera',
        'Ensure your entire face is visible',
        'Check the lighting conditions',
        'Try again',
      ];
    }

    return [
      'Check your internet connection',
      'Ensure camera permission is granted',
      'Try moving to a well-lit area',
      'Try again',
    ];
  },

  // Verify liveness and store result
  async verifyAndStore(userId: string): Promise<LivenessCheckResult> {
    const result = await this.checkFacialLiveness(userId);

    if (result.success) {
      // Store verification time
      await StorageService.setLivenessVerified(userId);
    }

    return result;
  },

  // Check if reverification is needed
  isReverificationNeeded(): boolean {
    // Reverification needed if verification is older than 1 hour
    // This is handled in StorageService.isLivenessVerified()
    return false; // Will check actual timestamp in implementation
  },
};
