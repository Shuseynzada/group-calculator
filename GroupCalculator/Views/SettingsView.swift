import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) private var dismiss

    private var t: Translations { store.t }

    var body: some View {
        NavigationStack {
            Form {
                // Language
                Section(header: Text(t.language)) {
                    HStack(spacing: 12) {
                        langButton(.az, label: "Az\u{0259}rbaycanca")
                        langButton(.en, label: "English")
                    }
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())
                    .padding(.vertical, 4)
                    .padding(.horizontal)
                }

                // Base Currency
                Section {
                    Picker(t.baseCurrency, selection: Binding(
                        get: { store.baseCurrency },
                        set: { store.setBaseCurrency($0) }
                    )) {
                        ForEach(currencies) { c in
                            Text(currencyDisplayName(c, lang: store.lang))
                                .tag(c.code)
                        }
                    }
                    .pickerStyle(.menu)
                } header: {
                    Text(t.baseCurrency)
                } footer: {
                    Text(t.baseCurrencyDesc)
                }

                // Exchange Rates
                Section {
                    ForEach(currencies.filter { $0.code != "AZN" }) { c in
                        HStack {
                            Text("1 \(c.code)")
                                .font(.subheadline.weight(.medium))
                                .frame(width: 60, alignment: .leading)
                            Text("=")
                                .foregroundColor(.secondary)
                            TextField(
                                "rate",
                                value: Binding(
                                    get: { store.exchangeRates[c.code] ?? 1.0 },
                                    set: { newVal in
                                        if newVal > 0 {
                                            store.setExchangeRate(code: c.code, rate: newVal)
                                        }
                                    }
                                ),
                                format: .number.precision(.fractionLength(3))
                            )
                            .keyboardType(.decimalPad)
                            .textFieldStyle(.roundedBorder)
                            .frame(maxWidth: 100)
                            Text("AZN")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    Button(t.resetDefaults) {
                        store.resetExchangeRates()
                    }
                    .foregroundColor(.emerald600)
                    .font(.subheadline)
                } header: {
                    Text(t.exchangeRates)
                } footer: {
                    Text(t.exchangeRatesDesc)
                }
            }
            .navigationTitle(t.settings)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(t.cancel) { dismiss() }
                }
            }
        }
    }

    private func langButton(_ lang: Lang, label: String) -> some View {
        Button {
            store.setLang(lang)
        } label: {
            Text(label)
                .font(.subheadline.weight(.medium))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(store.lang == lang ? Color.emerald600 : Color(.systemGray6))
                .foregroundColor(store.lang == lang ? .white : .primary)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(
                            store.lang == lang ? Color.emerald600 : Color(.separator),
                            lineWidth: 0.5
                        )
                )
        }
        .buttonStyle(.plain)
    }
}
