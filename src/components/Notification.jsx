import React, { useState, useEffect } from "react";

const Notification = ({ message, type = "success" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeoutId = setTimeout(() => {
      setIsVisible(false); // Reset visibility after timeout
    }, 3000);
    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [message, type]); // Re-render on message or type change

  const notificationStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px 30px",
    borderRadius: "5px",
    textAlign: "center",
    zIndex: 999,
    opacity: isVisible ? 1 : 0, // Transition opacity
  };

  return (
    isVisible && (
      <div
        style={{
          ...notificationStyles,
          background: type === "success" ? "white" : "#f4cccc",
        }}
      >
        {message}
      </div>
    )
  );
};

export default Notification;
