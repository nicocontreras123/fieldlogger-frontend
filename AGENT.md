# FieldLogger Frontend - React 19 PWA

## 🏗️ Architecture Overview

This frontend implements an **Offline-First PWA** using React 19's latest features and modern 2026 patterns.

### Technology Stack

- **React 19**: Latest features including Actions and `useActionState`
- **Vite 6**: Ultra-fast build tool with SWC compiler
- **Tailwind CSS v4**: Utility-first CSS with auto-detection
- **Dexie.js**: IndexedDB wrapper for offline storage
- **PWA**: Service Worker with Workbox for offline capabilities

## 🎯 Key React 19 Features Used

### 1. Form Actions (No External Libraries!)

```tsx
// Old way (React 18)
const [formData, setFormData] = useState({});
const handleSubmit = (e) => {
  e.preventDefault();
  // Manual form handling...
};

// New way (React 19)
const [state, formAction, isPending] = useActionState(createInspectionAction, {
  status: 'idle',
});

<form action={formAction}>
  {/* React handles everything */}
</form>
```

### 2. No Manual Memoization

The React Compiler automatically optimizes re-renders. **No need for `useMemo` or `useCallback`** unless dealing with very specific performance issues.

### 3. Optimistic UI with Dexie

Data is saved to IndexedDB immediately, providing instant feedback even offline.

## 📁 Project Structure

```
src/
├── components/
│   ├── CreateInspection.tsx   # Form with React 19 Actions
│   └── InspectionList.tsx     # Real-time list with Dexie
├── lib/
│   ├── db.ts                  # Dexie database configuration
│   └── sync-engine.ts         # Offline-first sync logic
├── App.tsx                    # Main app component
└── index.css                  # Tailwind + global styles
```

## 🔄 Offline-First Strategy

### How It Works

1. **User submits form** → Data saved to Dexie.js (IndexedDB) immediately
2. **Optimistic UI** → User sees instant feedback
3. **Sync Engine** → Detects network and syncs to backend automatically
4. **Status Updates** → UI shows sync status in real-time

### Sync Engine Features

- ✅ Automatic sync on network reconnection
- ✅ Periodic sync every 30 seconds when online
- ✅ Retry failed syncs
- ✅ Visual indicators for pending/synced status

## 🚀 Running the Frontend

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## 📱 PWA Features

### Service Worker

Configured via `vite-plugin-pwa`:
- Offline page caching
- API response caching (NetworkFirst strategy)
- Auto-update on new versions

### Install Prompt

The app can be installed on desktop and mobile devices:
- Chrome: "Install FieldLogger"
- iOS Safari: "Add to Home Screen"

## 🎨 Tailwind CSS v4

Tailwind v4 uses **automatic content detection** - no manual configuration needed!

### Custom Theme

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'cyber-dark': '#0f172a',
      'cyber-blue': '#3b82f6',
    },
  },
}
```

## 🧪 Adding New Features

### Adding a New Form Field

1. **Update Dexie Schema** (`lib/db.ts`)
   ```typescript
   export interface Inspection {
     // ... existing fields
     priority: 'low' | 'medium' | 'high';
   }
   ```

2. **Update Form** (`components/CreateInspection.tsx`)
   ```tsx
   <select name="priority">
     <option value="low">Low</option>
     <option value="medium">Medium</option>
     <option value="high">High</option>
   </select>
   ```

3. **Update Action**
   ```typescript
   const priority = formData.get('priority') as string;
   const inspection = { ...existing, priority };
   ```

### Adding a New Component

React 19 components are just functions - no special setup needed:

```tsx
export default function MyComponent() {
  // React Compiler handles optimization automatically
  return <div>Hello World</div>;
}
```

## 🔐 Data Flow

```
User Input
    ↓
Form Action (useActionState)
    ↓
Validation
    ↓
Dexie.js (IndexedDB) ← Optimistic UI
    ↓
Sync Engine
    ↓
NestJS Backend API
    ↓
Update Status in Dexie
```

## 📊 Debugging

### View IndexedDB Data

1. Open Chrome DevTools
2. Go to "Application" tab
3. Expand "IndexedDB" → "FieldLoggerDB" → "inspections"

### Monitor Sync Status

Check console for sync logs:
- `✅ Synced inspection: <id>`
- `🌐 Network detected, syncing...`

## 🎓 Learning Resources

- [React 19 Actions](https://react.dev/reference/react/useActionState)
- [Dexie.js Documentation](https://dexie.org)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app)
- [Tailwind CSS v4](https://tailwindcss.com)

## 🔄 Upgrading from React 18

Key changes:
- Replace `useState` + manual form handling with `useActionState`
- Remove `useMemo` and `useCallback` (React Compiler handles it)
- Use native form `action` prop instead of `onSubmit`
