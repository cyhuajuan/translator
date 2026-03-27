# Testing Patterns

**Analysis Date:** 2026-03-27

## Test Framework

**Status:** NOT INSTALLED

**No testing framework detected in the project.**

- No `jest.config.*` found
- No `vitest.config.*` found
- No test files (`.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`) found
- No testing dependencies in `package.json`

## Implications

**This codebase has no automated tests.**

All code in `src/` is untested at the unit and integration levels.

## Recommended Testing Setup

The codebase uses:
- **React 19** with functional components
- **TanStack Router** for routing
- **TanStack React Query** for data fetching
- **Biome** for linting/formatting
- **TypeScript** in strict mode

### Suggested Test Framework

**Vitest** is recommended as the testing framework:
- Native ESM support (matches `type: "module"` in package.json)
- Compatible with Vite-based projects
- TypeScript support out of the box
- React testing with `@testing-library/react`

### Suggested Dependencies

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/dom": "^10.0.0",
    "jsdom": "^24.0.0"
  }
}
```

### Suggested Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Test File Organization

**Not established - no tests exist.**

### Recommended Pattern

Place tests co-located with source files:

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── routes/
    ├── index.tsx
    └── index.test.tsx
```

## Test Structure Patterns

**Not established - no tests exist.**

### Recommended React Testing Patterns

```typescript
// Example button.test.tsx pattern
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Recommended Utility Testing Patterns

```typescript
// Example utils.test.ts pattern
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles tailwind-merge classes', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4'); // Later class wins
  });
});
```

## Mocking

**Not established - no tests exist.**

### Recommended Approach

Use Vitest's `vi.fn()` for mocking:

```typescript
import { vi, describe, it, expect } from 'vitest';

describe('hooks', () => {
  it('mocks useQuery', () => {
    const mockUseQuery = vi.fn();
    // Mock implementation
  });
});
```

For TanStack Query testing, use `@tanstack/react-query-devtools` or mock `QueryClient`.

## Coverage

**Not established.**

### Recommended Command

```bash
npx vitest run --coverage
```

## Running Tests

**Not established - no test scripts in package.json.**

### Recommended Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Type Testing

For comprehensive TypeScript testing, consider adding:

```bash
npm install -D @tsd/typescript
```

---

*Testing analysis: 2026-03-27*
