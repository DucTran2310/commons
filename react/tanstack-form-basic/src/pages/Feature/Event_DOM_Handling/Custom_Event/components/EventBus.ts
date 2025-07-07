export const EventBus = {
  emit(event: string, detail?: any) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },
  on(event: string, callback: (e: CustomEvent) => void) {
    const handler = (e: Event) => callback(e as CustomEvent);
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },
};
