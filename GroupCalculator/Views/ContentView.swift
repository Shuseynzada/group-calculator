import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: AppStore

    var body: some View {
        NavigationStack {
            HomeView()
        }
        .tint(.emerald600)
    }
}
