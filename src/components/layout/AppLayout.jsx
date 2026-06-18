import { Header } from './Header';

export function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">{children}</main>
    </div>
  );
}
