// Compatibilidade de tipos para Firebase Auth em React Native.
// O runtime React Native do Firebase exporta getReactNativePersistence,
// mas a entrada de tipos do pacote `firebase/auth` pode não expor esse símbolo
// durante a verificação isolada do TypeScript. Esta declaração apenas descreve
// a função já usada pelo runtime; não altera o comportamento da autenticação.
import 'firebase/auth';
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  function getReactNativePersistence(storage: {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
