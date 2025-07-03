import React from "react";
import { EventBus } from "./components/EventBus";
import { Toast } from "@/pages/Feature/Event_DOM_Handling/Custom_Event/components/Toast";
import { Modal } from "@/pages/Feature/Event_DOM_Handling/Custom_Event/components/Modal";

const Custom_Event: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-10">
      <Toast />
      <Modal />

      <h1 className="text-3xl font-bold mb-6">🎯 Custom Event Visualizer</h1>

      <div className="space-x-4">
        <button
          onClick={() => EventBus.emit("toast:show", "✅ Hello from Toast!")}
          className="px-4 py-2 bg-green-600 text-white rounded shadow"
        >
          Show Toast
        </button>
        <button
          onClick={() => EventBus.emit("modal:open")}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          Open Modal
        </button>
      </div>
    </div>
  );
};

export default Custom_Event;