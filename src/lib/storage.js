const STORAGE_KEY = 'ai-image-classifier';

export function getHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.history) ? parsed.history : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
}

export function appendHistoryItem(item, limit = 20) {
  const existing = getHistory();
  const next = [item, ...existing].slice(0, limit);
  saveHistory(next);
  return next;
}
