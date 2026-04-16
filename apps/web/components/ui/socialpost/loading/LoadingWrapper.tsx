"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner"; // adjust path

type Props = {
  children: React.ReactNode;
  delay?: number; // in milliseconds
};

const LoadingWrapper = ({ children, delay = 100 }: Props) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showContent) return <Spinner />;
  return <>{children}</>;
};

export default LoadingWrapper;
