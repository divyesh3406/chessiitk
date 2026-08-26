import React from 'react';
import ServerError500 from '../pages/ServerError500';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught rendering error:", error, errorInfo);
    
    const errorMsg = error && (error.message || String(error));
    const isChunkError = 
      errorMsg && 
      (errorMsg.includes('Failed to fetch') || 
       errorMsg.includes('dynamically imported module') || 
       errorMsg.includes('Expected a JavaScript-or-Wasm module script') ||
       errorMsg.includes('MIME type') ||
       errorMsg.includes('ChunkLoadError'));

    if (isChunkError) {
      console.warn("Chunk load error caught in ErrorBoundary. Reloading page to fetch latest build...");
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return <ServerError500 />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
