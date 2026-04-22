# Expense Tracker App

A comprehensive financial management application built with React Native and Expo that helps users track transactions, manage budgets, and visualize their spending patterns.

## Features

### ✅ Core Functionalities

#### 1. **Transaction Management**
- Log income and expenses
- Categorize transactions (salary, bonus, food, transport, entertainment, utilities, shopping, healthcare, education, rent, other)
- Add descriptions and notes
- View transaction history with detailed information
- Delete transactions

#### 2. **Security**
- Facial liveness verification for accessing sensitive dashboard
- Real-time user instructions during verification
- Proper handling of success and failure states
- Verification persistence (1-hour session)
- Recovery suggestions for failed attempts

#### 3. **Financial Overview**
- Real-time balance display
- Income and expense summaries
- Budget management system
- Set budgets for specific categories
- Monthly and yearly budget periods
- Budget status tracking (percentage used, amount remaining, exceeded alerts)

#### 4. **Recurring Transactions**
- Set up recurring transactions (daily, weekly, monthly, yearly)
- Automatic generation of transactions on due dates
- Configurable start and end dates
- Edit and delete recurring transactions

#### 5. **Data Visualization**
- Analytics dashboard with charts
- Monthly trend visualization (income vs expenses)
- Category breakdown with horizontal bar charts
- Expense and income distribution
- Visual spending patterns

#### 6. **Data Persistence**
- All data stored locally on device using AsyncStorage
- No backend required
- Data persists when app is closed and reopened

#### 7. **Bonus Features**

**Data Export:**
- Export transactions as CSV
- Export financial reports
- Share exported files

**Currency Formatting:**
- Support for multiple currencies (USD, EUR, GBP, JPY, INR, NGN, AUD, CAD)
- Proper currency symbol display
- Locale-specific formatting
- Thousands separator handling

## Tech Stack

- **Framework:** React Native with Expo
- **State Management:** Zustand
- **Storage:** AsyncStorage
- **Navigation:** Expo Router
- **UI Components:** React Native (native)
- **Icons:** Material Community Icons
- **Charts:** Custom chart components
- **Data Export:** CSV and text-based report generation

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

## Usage

### Adding a Transaction
1. Navigate to "Add Transaction" from dashboard or explore tab
2. Select transaction type (income/expense)
3. Enter amount and description
4. Select category
5. Tap "Add Transaction"

### Managing Budgets
1. Go to "Budgets" from dashboard
2. Tap "+" to create a new budget
3. Select category and set limit
4. Choose period (monthly/yearly)
5. Monitor budget status on the budgets screen

### Viewing Analytics
1. Navigate to "Analytics"
2. View monthly trends
3. See category breakdowns
4. Track spending patterns

### Exporting Data
1. Go to "Settings"
2. Choose "Export as CSV" or "Export as Report"
3. Select save location or share directly

### Facial Verification
1. On first app launch, complete facial liveness verification
2. Follow on-screen instructions
3. Verification is valid for 1 hour
4. Re-verify if needed after session expires

## Project Structure

All source code is contained in the app directory with screens, components, services, and utilities organized by feature.

## Features Highlights

- **Real-time Updates:** Balance updates immediately after transactions
- **Data Persistence:** All transactions stored locally
- **User-Friendly Interface:** Intuitive navigation with dark mode support
- **Security:** Facial liveness verification for dashboard access
- **Multi-Currency Support:** Format amounts in various currencies

## Supported Currencies

USD, EUR, GBP, JPY, INR, NGN, AUD, CAD

## Version
1.0.0
