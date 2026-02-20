/**
 * Jest Test Setup
 * Configures global mocks and test utilities
 */

// Polyfill TextEncoder/TextDecoder for jsdom
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.subtle for Web Crypto API
const mockCrypto = {
  getRandomValues: jest.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
  subtle: {
    importKey: jest.fn().mockResolvedValue({}),
    deriveKey: jest.fn().mockResolvedValue({}),
    encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    decrypt: jest.fn().mockResolvedValue(new TextEncoder().encode('decrypted')),
  },
};

Object.defineProperty(window, 'crypto', { value: mockCrypto });
Object.defineProperty(global, 'crypto', { value: mockCrypto });

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
  } as Response)
);

// Mock Office.js globals
(global as any).Office = {
  onReady: jest.fn((callback?: () => void) => {
    if (callback) callback();
    return Promise.resolve({ host: 'Excel', platform: 'Win32' });
  }),
  context: {
    requirements: {
      isSetSupported: jest.fn(() => true),
    },
  },
};

(global as any).Excel = {
  run: jest.fn(async (callback: (context: any) => Promise<void>) => {
    const mockContext = {
      workbook: {
        worksheets: {
          getActiveWorksheet: jest.fn(() => ({
            getRange: jest.fn(() => ({
              load: jest.fn().mockReturnThis(),
              values: [['Test']],
              format: {
                font: {},
                fill: {},
                autofitColumns: jest.fn(),
              },
              getResizedRange: jest.fn().mockReturnThis(),
            })),
            getUsedRange: jest.fn(() => ({
              load: jest.fn().mockReturnThis(),
              rowCount: 10,
              columnCount: 5,
              values: [['Header1', 'Header2']],
            })),
            name: 'Sheet1',
          })),
        },
        getSelectedRange: jest.fn(() => ({
          load: jest.fn().mockReturnThis(),
          values: [['Selected']],
        })),
      },
      sync: jest.fn().mockResolvedValue(undefined),
    };
    await callback(mockContext);
  }),
  ErrorCodes: {
    invalidArgument: 'InvalidArgument',
  },
};

// Console error spy for tracking errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args) => {
    // Suppress known safe errors during tests
    const message = args[0]?.toString() || '';
    if (
      message.includes('Not implemented') ||
      message.includes('act(...)') // React testing warning
    ) {
      return;
    }
    originalError.apply(console, args);
  });
});

afterAll(() => {
  console.error = originalError;
});

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

// Global test utilities
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockFetchResponse = (data: any, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    status: ok ? 200 : 400,
  });
};
