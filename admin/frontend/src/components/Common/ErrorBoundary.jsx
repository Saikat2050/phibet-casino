import React from 'react';
import { Container, Card, CardBody, Alert } from 'reactstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Container fluid>
          <Card>
            <CardBody>
              <Alert color="danger">
                <h4 className="alert-heading">Something went wrong!</h4>
                <p>
                  An error occurred while rendering this component. Please check the console for more details.
                </p>
                <hr />
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  <summary>Error Details (Click to expand)</summary>
                  <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                  <br />
                  <strong>Stack Trace:</strong> {this.state.errorInfo && this.state.errorInfo.componentStack}
                </details>
                <hr />
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </Alert>
            </CardBody>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
