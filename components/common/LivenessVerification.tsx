import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LivenessService } from '@/services/livenessService';
import { Button } from './Button';

interface LivenessVerificationProps {
  onSuccess: () => void;
  userId: string;
}

export const LivenessVerification: React.FC<LivenessVerificationProps> = ({
  onSuccess,
  userId,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'instructions' | 'checking' | 'success' | 'error'>(
    'instructions'
  );
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const instructions = LivenessService.getInstructions();

  const handleStartVerification = async () => {
    try {
      setLoading(true);
      setStep('checking');
      setError('');

      const result = await LivenessService.verifyAndStore(userId);

      if (result.success) {
        setStep('success');
        setTimeout(onSuccess, 1500);
      } else {
        setStep('error');
        setError(result.error || 'Liveness check failed');
        setSuggestions(LivenessService.getRecoverySuggestions(result.error));
      }
    } catch (err: any) {
      setStep('error');
      setError(err?.message || 'An error occurred');
      setSuggestions(LivenessService.getRecoverySuggestions());
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStep('instructions');
    setError('');
    setSuggestions([]);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Instructions Step */}
      {step === 'instructions' && (
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="face-recognition"
              size={64}
              color="#007AFF"
            />
          </View>

          <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Facial Liveness Verification
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? '#A1A1A6' : '#666' },
            ]}
          >
            We need to verify you're a real person for security
          </Text>

          <View style={styles.instructionsContainer}>
            <Text
              style={[
                styles.instructionsTitle,
                { color: isDark ? '#F2F2F7' : '#000' },
              ]}
            >
              Instructions:
            </Text>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#34C759"
                  style={styles.instructionIcon}
                />
                <Text
                  style={[
                    styles.instructionText,
                    { color: isDark ? '#A1A1A6' : '#666' },
                  ]}
                >
                  {instruction}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Start Verification"
            onPress={handleStartVerification}
            size="large"
            loading={loading}
          />
        </View>
      )}

      {/* Checking Step */}
      {step === 'checking' && (
        <View style={styles.stepContainer}>
          <View style={[styles.iconContainer, styles.animatedIcon]}>
            <ActivityIndicator size={64} color="#007AFF" />
          </View>
          <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Verifying Your Face
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? '#A1A1A6' : '#666' },
            ]}
          >
            Please hold still for a few seconds...
          </Text>
        </View>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: '#34C75920' },
            ]}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color="#34C759"
            />
          </View>
          <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Verification Successful
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? '#A1A1A6' : '#666' },
            ]}
          >
            You're verified. Welcome back!
          </Text>
        </View>
      )}

      {/* Error Step */}
      {step === 'error' && (
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: '#FF3B3020' },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              size={64}
              color="#FF3B30"
            />
          </View>
          <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Verification Failed
          </Text>
          <Text
            style={[
              styles.errorMessage,
              { color: isDark ? '#A1A1A6' : '#666' },
            ]}
          >
            {error}
          </Text>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text
                style={[
                  styles.suggestionsTitle,
                  { color: isDark ? '#F2F2F7' : '#000' },
                ]}
              >
                Try:
              </Text>
              {suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={16}
                    color="#FF9500"
                    style={styles.suggestionIcon}
                  />
                  <Text
                    style={[
                      styles.suggestionText,
                      { color: isDark ? '#A1A1A6' : '#666' },
                    ]}
                  >
                    {suggestion}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Button
            title="Try Again"
            onPress={handleRetry}
            size="large"
            loading={loading}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F2F2F7',
  },
  animatedIcon: {
    backgroundColor: '#007AFF20',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FF9500' + '20',
    borderRadius: 12,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  suggestionIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
  },
});
