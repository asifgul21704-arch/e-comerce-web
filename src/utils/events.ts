// Event & BroadcastChannel utility for instant multi-tab & cross-component sync
const BROADCAST_CHANNEL_NAME = 'novastore_sync_channel';
const CUSTOM_EVENT_NAME = 'novastore_catalog_changed';

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported in this environment', e);
  }
}

/**
 * Triggered whenever admin creates, updates, or deletes products or categories
 */
export function notifyCatalogChange(type: 'product' | 'category' | 'order' = 'product') {
  if (typeof window === 'undefined') return;

  const payload = { type, timestamp: Date.now() };

  // Dispatch local window event for same-window components
  window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: payload }));

  // Broadcast to other tabs/windows if available
  if (broadcastChannel) {
    broadcastChannel.postMessage(payload);
  }

  // Also write timestamp to localStorage to wake up any listener
  try {
    localStorage.setItem('novastore_last_sync', Date.now().toString());
  } catch (e) {
    // Ignore storage quota or disabled
  }
}

/**
 * Subscribes to catalog updates across same-window and cross-tabs
 */
export function subscribeToCatalogChange(callback: (detail?: any) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent;
    callback(custom.detail);
  };

  const handleBroadcast = (e: MessageEvent) => {
    callback(e.data);
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'novastore_last_sync') {
      callback();
    }
  };

  window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}
