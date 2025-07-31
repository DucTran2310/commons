import { useState } from "react";

export const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-10 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};