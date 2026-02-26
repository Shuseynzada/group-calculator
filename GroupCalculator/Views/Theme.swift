import SwiftUI

// MARK: - Emerald Theme Colors

extension Color {
    /// Emerald-600 — primary brand color
    static let emerald600 = Color(red: 5/255, green: 150/255, blue: 105/255)
    /// Emerald-700 — hover/pressed state
    static let emerald700 = Color(red: 4/255, green: 120/255, blue: 87/255)
    /// Emerald-500
    static let emerald500 = Color(red: 16/255, green: 185/255, blue: 129/255)
    /// Emerald-400
    static let emerald400 = Color(red: 52/255, green: 211/255, blue: 153/255)
    /// Emerald-50 (light chip bg)
    static let emerald50 = Color(red: 236/255, green: 253/255, blue: 245/255)
    /// Emerald-100
    static let emerald100 = Color(red: 209/255, green: 250/255, blue: 229/255)
    /// Emerald-200 border
    static let emerald200 = Color(red: 167/255, green: 243/255, blue: 208/255)
    /// Emerald-300 border
    static let emerald300 = Color(red: 110/255, green: 231/255, blue: 183/255)
    /// Emerald-800 dark border
    static let emerald800 = Color(red: 6/255, green: 95/255, blue: 70/255)
    /// Emerald-900/30 dark chip bg
    static let emerald900_30 = Color(red: 6/255, green: 78/255, blue: 59/255).opacity(0.3)
}

// MARK: - Adaptive Colors

extension Color {
    static let cardBackground = Color(.systemBackground)
    static let pageBackground = Color(.systemGroupedBackground)
    static let secondaryText = Color(.secondaryLabel)
    static let tertiaryText = Color(.tertiaryLabel)
}

// MARK: - Styled Button

struct EmeraldButtonStyle: ButtonStyle {
    var fullWidth: Bool = true

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.weight(.semibold))
            .foregroundColor(.white)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(configuration.isPressed ? Color.emerald700 : Color.emerald600)
            .cornerRadius(10)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.weight(.medium))
            .foregroundColor(.primary)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Color(.systemGray6))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color(.separator), lineWidth: 0.5)
            )
    }
}

// MARK: - Card Modifier

struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(Color.cardBackground)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(.separator).opacity(0.3), lineWidth: 0.5)
            )
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}

// MARK: - Section Header

struct SectionHeader: View {
    let title: String

    var body: some View {
        Text(title.uppercased())
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundColor(.secondaryText)
            .tracking(0.8)
    }
}
