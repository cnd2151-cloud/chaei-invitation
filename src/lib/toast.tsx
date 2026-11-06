import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ToastFn = (msg: string) => void;
const Ctx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const t = useRef<number | undefined>(undefined);
  const toast = useCallback<ToastFn>((m) => {
    window.clearTimeout(t.current);
    setMsg(m);
    setShow(true);
    t.current = window.setTimeout(() => setShow(false), 2200);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className={`toast${show ? ' is-show' : ''}`} role="status" aria-live="polite">
        {msg}
      </div>
    </Ctx.Provider>
  );
}
