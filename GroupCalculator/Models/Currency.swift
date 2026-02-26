import Foundation

// MARK: - Currency Configuration

struct CurrencyConfig: Identifiable, Equatable {
    var id: String { code }
    let code: String
    let symbol: String
    let name: String
    let nameAz: String
    let decimals: Int
    let position: CurrencyPosition
}

enum CurrencyPosition: String, Codable {
    case prefix
    case suffix
}

let currencies: [CurrencyConfig] = [
    CurrencyConfig(code: "AZN", symbol: "\u{20BC}", name: "Azerbaijani Manat", nameAz: "Az\u{0259}rbaycan Manat\u{0131}", decimals: 2, position: .suffix),
    CurrencyConfig(code: "USD", symbol: "$", name: "US Dollar", nameAz: "AB\u{015E} Dollar\u{0131}", decimals: 2, position: .prefix),
    CurrencyConfig(code: "EUR", symbol: "\u{20AC}", name: "Euro", nameAz: "Avro", decimals: 2, position: .prefix),
    CurrencyConfig(code: "GBP", symbol: "\u{00A3}", name: "British Pound", nameAz: "Britaniya Funtu", decimals: 2, position: .prefix),
    CurrencyConfig(code: "TRY", symbol: "\u{20BA}", name: "Turkish Lira", nameAz: "T\u{00FC}rk Lir\u{0259}si", decimals: 2, position: .suffix),
    CurrencyConfig(code: "RUB", symbol: "\u{20BD}", name: "Russian Ruble", nameAz: "Rus Rublu", decimals: 2, position: .suffix),
    CurrencyConfig(code: "GEL", symbol: "\u{20BE}", name: "Georgian Lari", nameAz: "G\u{00FC}rc\u{00FC} Larisi", decimals: 2, position: .suffix),
]

let defaultRatesToAZN: [String: Double] = [
    "AZN": 1,
    "USD": 1.70,
    "EUR": 1.85,
    "GBP": 2.15,
    "TRY": 0.053,
    "RUB": 0.019,
    "GEL": 0.64,
]

// MARK: - Currency Helpers

func getCurrencyConfig(_ code: String) -> CurrencyConfig {
    currencies.first(where: { $0.code == code }) ?? currencies[0]
}

func formatMoney(_ cents: Int, _ config: CurrencyConfig) -> String {
    let abs = Swift.abs(cents)
    let divisor = pow(10.0, Double(config.decimals))
    let value = Double(abs) / divisor
    let formatted: String
    if config.position == .prefix {
        formatted = "\(config.symbol)\(String(format: "%.\(config.decimals)f", value))"
    } else {
        formatted = "\(String(format: "%.\(config.decimals)f", value)) \(config.symbol)"
    }
    return cents < 0 ? "-\(formatted)" : formatted
}

func centsToPlain(_ cents: Int, _ config: CurrencyConfig) -> String {
    let divisor = pow(10.0, Double(config.decimals))
    return String(format: "%.\(config.decimals)f", Double(cents) / divisor)
}

func amountToCents(_ text: String) -> Int? {
    guard let value = Double(text), value > 0 else { return nil }
    return Int(round(value * 100))
}

/// Convert cents from one currency to another via AZN pivot.
func convertCurrency(_ cents: Int, from fromCurrency: String, to toCurrency: String, rates: [String: Double]) -> Int {
    if fromCurrency == toCurrency { return cents }
    let toAZN = rates[fromCurrency] ?? 1.0
    let fromAZN = rates[toCurrency] ?? 1.0
    return Int(round(Double(cents) * toAZN / fromAZN))
}

func currencyDisplayName(_ config: CurrencyConfig, lang: Lang) -> String {
    "\(config.symbol) \(config.code) — \(lang == .az ? config.nameAz : config.name)"
}
