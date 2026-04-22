import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation() as any;

  const features = [
    {
      title: 'Add Transaction',
      icon: 'plus-circle',
      color: '#007AFF',
      onPress: () => navigation.navigate('addTransaction'),
    },
    {
      title: 'View All Transactions',
      icon: 'list-box',
      color: '#34C759',
      onPress: () => navigation.navigate('transactions'),
    },
    {
      title: 'Analytics',
      icon: 'chart-pie',
      color: '#FF9500',
      onPress: () => navigation.navigate('analytics'),
    },
    {
      title: 'Budgets',
      icon: 'target',
      color: '#FF3B30',
      onPress: () => navigation.navigate('budgets'),
    },
    {
      title: 'Settings',
      icon: 'cog',
      color: '#A2845E',
      onPress: () => navigation.navigate('settings'),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>Features</Text>
      </View>

      <View style={styles.grid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.featureCard,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
            ]}
            onPress={feature.onPress}
          >
            <MaterialCommunityIcons
              name={feature.icon}
              size={40}
              color={feature.color}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
              {feature.title}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={isDark ? '#A1A1A6' : '#999'}
              style={styles.featureChevron}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Welcome to Expense Tracker
        </Text>
        <Text style={[styles.infoText, { color: isDark ? '#A1A1A6' : '#666' }]}>
          Manage your finances efficiently with our comprehensive expense tracking app.
        </Text>
        <Text style={[styles.infoText, { color: isDark ? '#A1A1A6' : '#666' }]}>
          Track transactions, set budgets, and visualize your spending patterns.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  grid: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  featureCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureIcon: {
    marginRight: 12,
  },
  featureTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  featureChevron: {
    marginLeft: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
