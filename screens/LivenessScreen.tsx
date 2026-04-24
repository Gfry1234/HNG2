import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useAppStore } from '@/context/appStore';
import { LivenessVerification } from '@/components/common/LivenessVerification';

export const LivenessScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { user, setLivenessVerified } = useAppStore();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    } else {
      // Create temporary user ID if no user exists
      setUserId(`user_${Date.now()}`);
    }
  }, [user]);

  const handleVerificationSuccess = async () => {
    try {
      await setLivenessVerified(true);
      navigation.replace('dashboard');
    } catch (error) {
      console.error('Error setting liveness verification:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {userId && (
        <LivenessVerification userId={userId} onSuccess={handleVerificationSuccess} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
