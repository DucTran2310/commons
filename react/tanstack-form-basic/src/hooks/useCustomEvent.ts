import { EventBus } from "@/pages/Feature/Event_DOM_Handling/Custom_Event/components/EventBus";
import { useEffect } from "react";

export const useCustomEvent = (event: string, handler: (e: CustomEvent) => void) => {
  useEffect(() => {
    return EventBus.on(event, handler);
  }, [event]);
};
