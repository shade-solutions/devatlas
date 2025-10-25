// Progress states for each node
export type ProgressStatus = 'todo' | 'learning' | 'done';

// Progress data structure
export interface NodeProgress {
  nodeId: string;
  roadmapId: string;
  status: ProgressStatus;
  updatedAt: string;
  notes?: string;
}

// Progress store by roadmapId -> nodeId -> progress
let progressStore: Record<string, Record<string, NodeProgress>> = {};

// Key for localStorage
const STORAGE_KEY = 'devatlas-progress';

/**
 * Load progress from localStorage
 */
export const loadProgressFromStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      progressStore = data;
    }
  } catch (error) {
    console.error('Failed to load progress from storage:', error);
  }
};

/**
 * Save progress to localStorage
 */
export const saveProgressToStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressStore));
  } catch (error) {
    console.error('Failed to save progress to storage:', error);
  }
};

/**
 * Get progress for a specific node
 */
export const getNodeProgress = (roadmapId: string, nodeId: string): NodeProgress | null => {
  return progressStore[roadmapId]?.[nodeId] || null;
};

/**
 * Set progress for a specific node
 */
export const setNodeProgress = (roadmapId: string, nodeId: string, status: ProgressStatus, notes?: string) => {
  if (!progressStore[roadmapId]) {
    progressStore[roadmapId] = {};
  }
  
  progressStore[roadmapId][nodeId] = {
    nodeId,
    roadmapId,
    status,
    updatedAt: new Date().toISOString(),
    notes,
  };
  
  saveProgressToStorage();
};

/**
 * Cycle through progress states: todo -> learning -> done -> todo
 */
export const cycleNodeProgress = (roadmapId: string, nodeId: string) => {
  const current = getNodeProgress(roadmapId, nodeId);
  let nextStatus: ProgressStatus;
  
  if (!current || current.status === 'todo') {
    nextStatus = 'learning';
  } else if (current.status === 'learning') {
    nextStatus = 'done';
  } else {
    nextStatus = 'todo';
  }
  
  setNodeProgress(roadmapId, nodeId, nextStatus);
};

/**
 * Get all progress for a roadmap
 */
export const getRoadmapProgress = (roadmapId: string): Record<string, NodeProgress> => {
  return progressStore[roadmapId] || {};
};

/**
 * Compute progress statistics for a roadmap
 */
export const computeProgressStats = (roadmapId: string, totalNodes: number) => {
  const progress = getRoadmapProgress(roadmapId);
  const progressValues = Object.values(progress);
  
  const todoCount = progressValues.filter(p => p.status === 'todo').length;
  const learningCount = progressValues.filter(p => p.status === 'learning').length;
  const doneCount = progressValues.filter(p => p.status === 'done').length;
  const totalStarted = learningCount + doneCount;
  
  return {
    total: totalNodes,
    todo: todoCount,
    learning: learningCount,
    done: doneCount,
    started: totalStarted,
    completionPercentage: totalNodes > 0 ? Math.round((doneCount / totalNodes) * 100) : 0,
    progressPercentage: totalNodes > 0 ? Math.round((totalStarted / totalNodes) * 100) : 0,
  };
};

/**
 * Clear all progress for a roadmap
 */
export const clearRoadmapProgress = (roadmapId: string) => {
  delete progressStore[roadmapId];
  saveProgressToStorage();
};

/**
 * Export progress data as JSON
 */
export const exportProgress = () => {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: progressStore,
  };
};

/**
 * Import progress data from JSON
 */
export const importProgress = (data: any, merge: boolean = false): boolean => {
  try {
    if (!data.data || typeof data.data !== 'object') {
      throw new Error('Invalid progress data format');
    }
    
    if (merge) {
      // Merge with existing progress
      for (const [roadmapId, roadmapProgress] of Object.entries(data.data)) {
        if (!progressStore[roadmapId]) {
          progressStore[roadmapId] = {};
        }
        Object.assign(progressStore[roadmapId], roadmapProgress);
      }
    } else {
      // Replace all progress
      progressStore = data.data;
    }
    
    saveProgressToStorage();
    return true;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return false;
  }
};

/**
 * Get progress status for display
 */
export const getProgressStatusInfo = (status: ProgressStatus) => {
  switch (status) {
    case 'todo':
      return {
        label: 'To Do',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
      };
    case 'learning':
      return {
        label: 'Learning',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
      };
    case 'done':
      return {
        label: 'Done',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
      };
    default:
      return {
        label: 'Unknown',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
      };
  }
};

/**
 * Hook to initialize progress store (call on app startup)
 */
export const useProgressStore = () => {
  // Load from storage on initialization
  loadProgressFromStorage();
  return {
    getNodeProgress,
    setNodeProgress,
    cycleNodeProgress,
    getRoadmapProgress,
    computeProgressStats,
    clearRoadmapProgress,
    exportProgress,
    importProgress,
    getProgressStatusInfo,
    getProgressStore: () => progressStore,
  };
};

// Export getter for the store
export const getProgressStore = () => progressStore;