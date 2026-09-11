# Fable Model Documentation

## Overview
Fable is a lightweight, declarative model framework for building dynamic and interactive user experiences. It emphasizes composition, type-safety, and reactive programming patterns with minimal overhead and maximum flexibility.

## Key Features

- **Reactive Data Binding**: Automatic UI updates on data changes
- **Composable Components**: Build complex UIs from simple, reusable pieces
- **Type-Safe**: Full type checking for props, events, and state
- **Immutable State Management**: Predictable state transitions
- **Performance Optimized**: Virtual DOM diffing and batch updates
- **Developer Experience**: Hot module reloading and detailed error messages
- **Framework Agnostic**: Works with any rendering engine

## Architecture

```
┌─────────────────────────────────┐
│   Component Layer               │
│   (Composition & Logic)         │
├─────────────────────────────────┤
│   State Management              │
│   (Immutable State Store)       │
├─────────────────────────────────┤
│   Virtual DOM                   │
│   (Diffing & Reconciliation)    │
├─────────────────────────────────┤
│   Rendering Engine              │
│   (DOM/Canvas/Custom)           │
└─────────────────────────────────┘
```

## Core Concepts

### Components

```typescript
type Model = {
  counter: number;
  loading: boolean;
};

type Message =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" };

const init = (): Model => ({
  counter: 0,
  loading: false,
});

const update = (msg: Message, model: Model): Model => {
  switch (msg.type) {
    case "INCREMENT":
      return { ...model, counter: model.counter + 1 };
    case "DECREMENT":
      return { ...model, counter: model.counter - 1 };
    case "RESET":
      return { ...model, counter: 0 };
  }
};

const view = (model: Model, dispatch: (msg: Message) => void) => ({
  template: "counter",
  props: {
    count: model.counter,
    onIncrement: () => dispatch({ type: "INCREMENT" }),
    onDecrement: () => dispatch({ type: "DECREMENT" }),
    onReset: () => dispatch({ type: "RESET" }),
  },
});
```

### State Management

- **Unidirectional Data Flow**: Props down, events up
- **Pure Functions**: Predictable state transformations
- **Time-Travel Debugging**: Replay and inspect state changes
- **DevTools Integration**: Browser extension for state inspection

## Installation

```bash
npm install fable
```

## Quick Start

```typescript
import { createApp } from "fable";

type AppState = {
  message: string;
  items: string[];
};

const app = createApp<AppState>(
  {
    message: "Hello, Fable!",
    items: [],
  },
  (state, action) => {
    switch (action.type) {
      case "UPDATE_MESSAGE":
        return { ...state, message: action.payload };
      case "ADD_ITEM":
        return { ...state, items: [...state.items, action.payload] };
      default:
        return state;
    }
  }
);

app.render("#app");
```

## Advanced Features

### Hooks System

```typescript
const useAsync = (fn: () => Promise<T>, deps?: any[]) => {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fn().then(data => {
      setState(data);
      setLoading(false);
    });
  }, deps);
  
  return [state, loading];
};
```

### Middleware

```typescript
const loggerMiddleware = (dispatch) => (action) => {
  console.log("Action:", action);
  return dispatch(action);
};

app.use(loggerMiddleware);
```

### Lazy Loading

```typescript
const LazyComponent = lazy(() => import("./HeavyComponent"));

const render = (model) => ({
  template: "app",
  props: {
    content: LazyComponent,
  },
});
```

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Initial Bundle | 8-12 KB (gzip) |
| Runtime Overhead | < 2% |
| Component Mount | < 5ms |
| State Update | < 1ms |
| Memory Usage | ~500KB (base) |

## Best Practices

1. **Keep Components Pure**: Avoid side effects in render functions
2. **Use Immutable Updates**: Always create new objects for state changes
3. **Memoize Expensive Computations**: Use `useMemo` hook for optimization
4. **Lazy Load Large Components**: Split code and load on demand
5. **Leverage TypeScript**: Full type definitions for better DX
6. **Handle Errors Gracefully**: Implement error boundaries
7. **Test State Transitions**: Unit test all reducer functions

## API Reference

### Core Functions

#### `createApp(initialState, reducer, options?)`
Creates a new Fable application instance.

```typescript
const app = createApp(
  { count: 0 },
  (state, action) => { /* reducer logic */ },
  {
    devTools: true,
    middleware: [loggerMiddleware],
  }
);
```

#### `useState(initialValue)`
Manages component-level state.

```typescript
const [value, setValue] = useState(0);
```

#### `useEffect(callback, dependencies?)`
Handles side effects and lifecycle.

```typescript
useEffect(() => {
  // Side effect logic
}, [dependency]);
```

#### `useContext(context)`
Accesses context values across components.

```typescript
const theme = useContext(ThemeContext);
```

## Debugging

### DevTools Integration

Enable DevTools to inspect state, replay actions, and time-travel debug:

```typescript
const app = createApp(initialState, reducer, {
  devTools: true,
});
```

### Logger Middleware

```typescript
const logger = (dispatch) => (action) => {
  console.group(action.type);
  console.info("Action:", action);
  const result = dispatch(action);
  console.log("New State:", result);
  console.groupEnd();
  return result;
};
```

## Examples

### Todo App

```typescript
type Todo = { id: string; text: string; done: boolean };
type State = { todos: Todo[] };

const reducer = (state: State, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        todos: [...state.todos, { id: Date.now().toString(), text: action.payload, done: false }],
      };
    case "TOGGLE_TODO":
      return {
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    default:
      return state;
  }
};
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome for Android

## Troubleshooting

### State Not Updating
- Ensure reducer returns new object references
- Check that components are properly subscribed to state changes

### Performance Issues
- Use React DevTools Profiler to identify slow renders
- Memoize expensive computations
- Implement code splitting for large bundles

### Type Errors
- Verify TypeScript configuration
- Use strict mode for better type checking

## Resources

- Documentation: https://fable.dev/docs
- GitHub Repository: https://github.com/fable-compiler/fable
- Community Discord: https://discord.gg/fable
- Examples: https://fable.dev/examples
- Tutorials: https://fable.dev/tutorials
