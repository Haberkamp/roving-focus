# Dummy React Package

A dummy React package with TypeScript and Vitest setup for testing purposes.

## Features

- ✅ React 19 peer dependency
- ✅ TypeScript support
- ✅ Vitest testing setup
- ✅ Sample Button component with tests

## Installation

```bash
npm install
```

## Scripts

- `npm run build` - Build the package with TypeScript
- `npm run dev` - Build in watch mode
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report

## Usage

```tsx
import { Button } from 'dummy-react-package'

function App() {
  return (
    <Button onClick={() => console.log('clicked!')}>
      Click me
    </Button>
  )
}
```

## Development

This package includes:
- A sample `Button` component with TypeScript interfaces
- Comprehensive test suite using Vitest and Testing Library
- TypeScript configuration optimized for React development
- Vitest configuration with jsdom environment for React testing

## Peer Dependencies

- React ^19.0.0

Make sure to install React 19 in your project to use this package.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
