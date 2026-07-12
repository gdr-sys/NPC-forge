// Local storage-backed persistence for NPCs.
// Replaces the previous PostgreSQL + Drizzle + API routes setup so the app
// can be deployed anywhere with zero backend/database requirements.

export interface SavedNPC {
  id: string;
  name: string;
  setting: string;
  role: string;
  appearance: string[];
  personality: string[];
  secret: string;
  motivation: string;
  hook: string;
  quote: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
}

const STORAGE_KEY = "npc-forge:npcs";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): SavedNPC[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error reading NPCs from localStorage:", e);
    return [];
  }
}

function writeAll(npcs: SavedNPC[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(npcs));
  } catch (e) {
    console.error("Error writing NPCs to localStorage:", e);
  }
}

function uid() {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID();
  return `npc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface ListFilters {
  setting?: string | null;
  search?: string | null;
  favoritesOnly?: boolean;
}

export function listNPCs(filters: ListFilters = {}): SavedNPC[] {
  let result = readAll();

  if (filters.setting && filters.setting !== "all") {
    result = result.filter((n) => n.setting === filters.setting);
  }
  if (filters.favoritesOnly) {
    result = result.filter((n) => n.isFavorite);
  }
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (n) => n.name.toLowerCase().includes(q) || n.role.toLowerCase().includes(q)
    );
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export type NewNPCInput = Omit<SavedNPC, "id" | "createdAt"> & {
  isFavorite?: boolean;
  tags?: string[];
};

export function createNPC(input: NewNPCInput): SavedNPC {
  const npc: SavedNPC = {
    id: uid(),
    name: input.name,
    setting: input.setting,
    role: input.role,
    appearance: input.appearance,
    personality: input.personality,
    secret: input.secret,
    motivation: input.motivation,
    hook: input.hook,
    quote: input.quote,
    isFavorite: input.isFavorite || false,
    tags: input.tags || [],
    createdAt: new Date().toISOString(),
  };

  const all = readAll();
  all.push(npc);
  writeAll(all);
  return npc;
}

export function updateNPC(id: string, patch: Partial<SavedNPC>): SavedNPC | null {
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id);
  if (idx === -1) return null;

  all[idx] = { ...all[idx], ...patch, id: all[idx].id };
  writeAll(all);
  return all[idx];
}

export function deleteNPC(id: string): boolean {
  const all = readAll();
  const next = all.filter((n) => n.id !== id);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}

export function exportAllNPCs(): SavedNPC[] {
  return readAll();
}

export function importNPCs(items: NewNPCInput[]): SavedNPC[] {
  return items.map((item) => createNPC(item));
}
