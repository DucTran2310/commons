import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lỗi UI:", error, errorInfo);
    // Có thể gửi log về server tại đây nếu cần
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
          <div className="max-w-md bg-white shadow-lg rounded-2xl p-6 md:p-10 border border-gray-200">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Có lỗi xảy ra!</h1>
            <p className="text-gray-600 mb-6">Xin lỗi vì sự bất tiện. Vui lòng thử tải lại trang.</p>
            <button onClick={this.handleReload} className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
              🔄 Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
