import { vi, afterEach } from 'vitest';

// Só configura bibliotecas de DOM se estivermos em ambiente JSDOM
if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom');
  const { cleanup } = require('@testing-library/react');
  
  // Limpeza automática após cada teste
  afterEach(() => {
    cleanup();
  });
}

// Polyfill para TextEncoder/TextDecoder se não existirem (comum em Node antigo ou ambientes restritos)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock do src/firebase.ts
vi.mock('../firebase', () => ({
  db: {
    type: 'firestore',
  },
  auth: {
    currentUser: {
      uid: 'user-123',
      email: 'test@example.com',
      displayName: 'Usuário Teste',
    },
    onAuthStateChanged: vi.fn((cb) => {
      cb({
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Usuário Teste',
      });
      return () => {};
    }),
  },
  googleProvider: {},
  OperationType: {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LIST: 'list',
    GET: 'get',
    WRITE: 'write',
  },
  handleFirestoreError: vi.fn((error, operationType, path) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        isAnonymous: false,
        providerInfo: []
      },
      operationType,
      path
    };
    console.error('Firestore Error Details:', JSON.stringify(errInfo, null, 2));
    throw new Error(JSON.stringify(errInfo));
  }),
}));

// Mock do Firebase SDK para utilitários
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn().mockReturnValue(() => {}),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  increment: vi.fn((n) => ({ _type: 'increment', n })),
  deleteField: vi.fn(() => ({ _type: 'deleteField' })),
  serverTimestamp: vi.fn(() => ({ _type: 'serverTimestamp' })),
  Timestamp: class {
    constructor(public seconds: number, public nanoseconds: number) {}
    static fromDate(date: Date) {
      return new (this as any)(Math.floor(date.getTime() / 1000), 0);
    }
    static now() {
      return (this as any).fromDate(new Date());
    }
    toDate() {
      return new Date(this.seconds * 1000);
    }
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

if (typeof window !== 'undefined') {
  (window as any).aistudio = {
    hasSelectedApiKey: vi.fn().mockResolvedValue(true),
    openSelectKey: vi.fn().mockResolvedValue(undefined),
  };
  window.scrollTo = vi.fn();
}

// Mock do crypto.randomUUID se não existir no ambiente de teste
if (!crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substring(2)),
  });
}
