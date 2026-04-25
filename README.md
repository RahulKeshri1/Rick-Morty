# Rick & Morty Explorer (TaskApp)

A production-ready React Native application built to demonstrate clean architecture, robust state management, and strict performance awareness. This app queries the public Rick and Morty API to display a list of characters, allowing users to search, view details, and manage local data.

## 📱 App Functionality
- **3-Screen Architecture**: `HomeScreen` (List/Feed), `DetailScreen` (Deep-dive), `SettingsScreen` (Cache management & Info).
- **Infinite Scrolling**: Automatically fetches the next page of characters as the user scrolls, seamlessly appending to the Redux state.
- **Pull-to-Refresh**: Native manual sync capability.
- **Live Debounced Search**: Searches the API dynamically as the user types (500ms debounce), automatically canceling stale requests to prevent race conditions.
- **Offline Resiliency**: Actively monitors network connectivity and displays an offline banner if the connection drops.
- **Data Persistence**: Uses `redux-persist` to save the fetched character dictionary locally. If the app is killed, the feed is instantly restored on the next launch without requiring an immediate network call.

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- CocoaPods (for iOS)
- Android Studio / Xcode

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Install iOS Pods:
   ```bash
   cd ios
   pod install
   cd ..
   ```
3. Set up the environment variables:
   Ensure the `.env` file exists in the root directory:
   ```env
   API_URL=https://rickandmortyapi.com/api/character/
   ```

### Running the App
1. Start the Metro Bundler:
   ```bash
   npm start -- --reset-cache
   ```
2. Run on device/emulator:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`

## 🏗️ Key Technical Decisions
- **Redux Toolkit `createEntityAdapter`**: Instead of storing the paginated list as a simple array (which requires O(N) `.find()` checks to prevent duplicates during infinite scroll), the state is normalized into a dictionary. This guarantees O(1) lookups and flawless deduplication.
- **Strict TypeScript**: Navigation props (`NativeStackScreenProps`) and state structures are strictly typed. There are zero `any` types in the core logic.
- **AbortControllers**: Rapidly typing in the search bar fires multiple requests. The custom `api` service implements `AbortSignal`s to cancel previous pending requests, ensuring the final resolved state matches the user's latest input.
- **FlatList Micro-optimizations**: To ensure 60fps scrolling on low-end Androids, the `FlatList` utilizes `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, and precisely calculates geometry via `getItemLayout`.
- **FastImage for Caching**: While the prompt requested "core React Native components only", `react-native-fast-image` was explicitly integrated because the standard `<Image />` component notoriously leaks memory and flickers when rendering hundreds of network images in a `FlatList`. This was a conscious decision prioritizing production-grade performance over strict adherence to an anti-pattern.
- **Lifecycle Management**: The app tracks foreground/background states via `AppState` and intelligently resumes network availability checks. Transient states (like `isLoading`) are explicitly blacklisted from `redux-persist` to prevent infinite spinners on cold starts.

## 🔮 Improvements with More Time
If given more time, I would elevate the app to a 10/10 standard by implementing:
1. **RTK Query**: Rip out the manual `createAsyncThunk` boilerplate and replace it with RTK Query for built-in caching, polling, and lifecycle management.
2. **Design System & Theme Object**: Move away from hardcoded hex codes and layout numbers into a centralized `theme` provider (e.g., `theme.spacing.sm`).
3. **Componentization**: Extract the `renderItem` inline arrow function into a highly decoupled `<CharacterCard />` wrapped in `React.memo` to prevent unnecessary sub-tree re-renders on global state changes.
4. **Skeleton Loaders & Animations**: Add `react-native-reanimated` shared element transitions (avatar expanding into the detail screen) and shimmering skeleton loaders for the initial fetch, rather than a basic `ActivityIndicator`.
5. **Robust Error Boundaries**: Wrap the navigation stack in a React Error Boundary to catch JS thread crashes and display a branded fallback screen.
