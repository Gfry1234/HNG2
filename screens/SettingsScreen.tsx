import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/context/appStore';
import { CurrencyUtils } from '@/utils/currencyUtils';
import { ExportUtils } from '@/utils/exportUtils';
import { Button } from '@/components/common/Button';
import { User } from '@/types';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [userName, setUserName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const {
    user,
    setUser,
    clearAllData,
    transactions,
    recurringTransactions,
    budgets,
    summary,
  } = useAppStore();

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setCurrency(user.currency);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      const updatedUser: User = {
        id: user?.id || `user_${Date.now()}`,
        name: userName,
        currency,
        theme: colorScheme as any,
      };
      await setUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save profile');
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      await ExportUtils.exportToCSV(transactions, recurringTransactions, budgets);
      Alert.alert('Success', 'Data exported as CSV');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      if (summary) {
        await ExportUtils.exportToPDF(transactions, summary);
        Alert.alert('Success', 'Report exported as PDF');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const handleClearData = () => {
    Alert.alert('Clear All Data', 'This action cannot be undone. All data will be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: async () => {
          try {
            await clearAllData();
            Alert.alert('Success', 'All data cleared');
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to clear data');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const supportedCurrencies = CurrencyUtils.getSupportedCurrencies();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={isDark ? '#F2F2F7' : '#000'}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Settings
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Profile
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
          ]}
        >
          <Text style={[styles.label, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#fff',
                color: isDark ? '#F2F2F7' : '#000',
                borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
              },
            ]}
            placeholder="Your name"
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={userName}
            onChangeText={setUserName}
          />

          <Text style={[styles.label, { color: isDark ? '#F2F2F7' : '#000', marginTop: 12 }]}>
            Currency
          </Text>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#fff',
                borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
              },
            ]}
            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
          >
            <Text style={[styles.currencyButtonText, { color: isDark ? '#F2F2F7' : '#000' }]}>
              {currency} {CurrencyUtils.getSymbol(currency)}
            </Text>
            <MaterialCommunityIcons
              name={showCurrencyPicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isDark ? '#F2F2F7' : '#000'}
            />
          </TouchableOpacity>

          {showCurrencyPicker && (
            <View style={styles.currencyList}>
              {supportedCurrencies.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  style={[
                    styles.currencyOption,
                    currency === curr && styles.currencyOptionActive,
                  ]}
                  onPress={() => {
                    setCurrency(curr);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.currencyOptionText,
                      {
                        color:
                          currency === curr
                            ? '#007AFF'
                            : isDark
                            ? '#F2F2F7'
                            : '#000',
                      },
                    ]}
                  >
                    {curr} {CurrencyUtils.getSymbol(curr)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Button
            title="Save Profile"
            onPress={handleSaveProfile}
            size="medium"
            variant="primary"
          />
        </View>
      </View>

      {/* Export Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Export Data
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
          ]}
        >
          <Text style={[styles.description, { color: isDark ? '#A1A1A6' : '#666' }]}>
            Export your financial data for backup or analysis
          </Text>

          <Button
            title="Export as CSV"
            onPress={handleExportCSV}
            loading={exporting}
            size="medium"
            variant="secondary"
          />

          <Button
            title="Export as Report"
            onPress={handleExportPDF}
            loading={exporting}
            size="medium"
            variant="secondary"
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          About
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
          ]}
        >
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
              App Version
            </Text>
            <Text style={[styles.aboutValue, { color: isDark ? '#F2F2F7' : '#000' }]}>
              1.0.0
            </Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
              Total Transactions
            </Text>
            <Text style={[styles.aboutValue, { color: isDark ? '#F2F2F7' : '#000' }]}>
              {transactions.length}
            </Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
              Data Storage
            </Text>
            <Text style={[styles.aboutValue, { color: isDark ? '#F2F2F7' : '#000' }]}>
              Local Device
            </Text>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>
          Danger Zone
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
          ]}
        >
          <Button
            title="Clear All Data"
            onPress={handleClearData}
            size="medium"
            variant="danger"
          />
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  currencyButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyList: {
    borderRadius: 8,
    marginVertical: 8,
    maxHeight: 200,
  },
  currencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  currencyOptionActive: {},
  currencyOptionText: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  aboutLabel: {
    fontSize: 14,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
