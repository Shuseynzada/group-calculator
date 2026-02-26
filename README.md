# Group Calculator — iOS (SwiftUI)

A "Splitwise-lite" iOS app for splitting expenses between friends.

## Features

- **Groups**: Create, edit, delete groups
- **Members**: Add/edit/delete members per group
- **Expenses**: Add/edit/delete with optional title, per-expense currency, date picker, payer & participant selection
- **7 Currencies**: AZN ₼, USD $, EUR €, GBP £, TRY ₺, RUB ₽, GEL ₾
- **Editable Exchange Rates**: Rates stored to AZN as pivot, fully customizable
- **Configurable Base Currency**: All balances/settlements displayed in your chosen currency
- **Balances Table**: Paid, owed, net per member
- **Optimal Settlement**: Bitmask DP algorithm (≤20 members) for minimum transactions, greedy fallback
- **i18n**: Azerbaijani (default) and English
- **Dark Mode**: Automatic system support
- **Emerald Theme**: Green accent throughout
- **JSON File Persistence**: Data saved to documents directory

## Project Structure

```
GroupCalculator/
  GroupCalculatorApp.swift          — App entry point
  Models/
    Models.swift                    — Group, Member, Expense, MemberBalance, Settlement
    Currency.swift                  — 7 currencies, rates, conversion, formatting
    I18n.swift                      — az/en translations (~80+ keys)
  Services/
    SplitEngine.swift               — computeBalances + bitmask DP settlement
    StorageService.swift            — JSON file CRUD
  ViewModels/
    AppStore.swift                  — Central ObservableObject
  Views/
    Theme.swift                     — Emerald colors, button styles, card modifier
    ContentView.swift               — Root NavigationStack
    HomeView.swift                  — Group list, create, how-it-works
    SettingsView.swift              — Language, base currency, exchange rates
    GroupDetailView.swift           — Tabbed dashboard (Members/Expenses/Balances/Settlement)
    Components/
      MemberComponents.swift        — Add member form, member chips with edit/delete
      AddExpenseSection.swift       — Expense creation form
      ExpenseListSection.swift      — Expense cards with inline edit/delete
      BalanceSettlementViews.swift  — Balances table + settlement list
```

## Requirements

- iOS 17.0+
- Xcode 15.4+
- Swift 5.9+

## Getting Started

1. Open `GroupCalculator.xcodeproj` in Xcode
2. Select a simulator or device
3. Build & Run (⌘R)
