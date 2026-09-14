import React from 'react';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

// Без границы ошибок любое исключение в рендере или эффекте размонтирует всё
// дерево React, и пользователь видит пустую белую страницу без объяснений.
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Необработанная ошибка интерфейса:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="fatal-error">
        <div className="fatal-error__card">
          <div className="fatal-error__title">Не удалось отобразить страницу</div>
          <p className="fatal-error__text">
            Произошла ошибка в интерфейсе. Обновите страницу, а если ошибка повторяется —
            передайте текст ниже разработчикам.
          </p>
          <pre className="fatal-error__details">{error.message}</pre>
          <button type="button" className="fatal-error__button" onClick={() => window.location.reload()}>
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
