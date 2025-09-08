export function ThemeScript() {
  const codeToRunOnClient = `
    (function() {
      try {
        const storageKey = 'donghua-ui-theme';
        const defaultTheme = 'system';
        
        const storedTheme = localStorage.getItem(storageKey);
        const theme = storedTheme || defaultTheme;
        
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      } catch (e) {
        // Fallback to light theme if there's an error
        document.documentElement.classList.add('light');
      }
    })()
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRunOnClient,
      }}
      suppressHydrationWarning
    />
  );
}
