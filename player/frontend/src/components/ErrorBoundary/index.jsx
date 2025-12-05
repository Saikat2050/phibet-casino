"use client";
import Image from "next/image";
import React, { Component } from "react";
import error from "../../../public/assets/img/png/error.webp";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return {
      hasError: true,
      errorMessage: error.message || "An unexpected error occurred",
    };
  }

  componentDidCatch(error, info) {
    // Log error details (optional)
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  handleRedirect = () => {
    const newPath = `/`;
    window.history.replaceState(null, "", newPath);
    // this.props.router.push('/'); // Using router.push from Next.js
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-white py-4  z-50">
          <div className="relative">
            <Image
              src={error}
              className="h-full w-[70%] mx-xl:w-[60%] m-auto"
              alt="Not-Found"
            />
            <div className="text-center">
              <p className="mt-6 text-white text-xl">
                {this.state.errorMessage ||
                  "Something went wrong. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
