import React, { Component, ErrorInfo } from 'react';
import FailedToLoadPage from '@/pages/informationPage/failedToLoadPage';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FailedToLoadPage />;
    }

    return this.props.children;
  }
}

export default function ErrorBoundary(props: Props) {
  return <ErrorBoundaryClass {...props} />;
} 