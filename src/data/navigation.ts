export type Status = 'done' | 'pending';

export interface NavItem {
  path: string;
  label: string;
  group: string;
  phase: number;
  status: Status;
  desc: string;
}

// Single source of truth for sidebar, dashboard cards and placeholder pages.
// When a phase is implemented, set status to 'done' and register its page in App.tsx.
export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', group: 'Overview', phase: 1, status: 'done', desc: 'Integrated overview of all modules.' },

  { path: '/citizen/certificates', label: 'Certificates', group: 'Citizen Portal', phase: 2, status: 'done', desc: 'Apply for income, caste, domicile and birth certificates.' },
  { path: '/citizen/tax', label: 'Property Tax', group: 'Citizen Portal', phase: 2, status: 'done', desc: 'Estimate property tax and simulate payment with a demo receipt.' },
  { path: '/citizen/grievances', label: 'Grievances', group: 'Citizen Portal', phase: 2, status: 'done', desc: 'Report civic problems and get a complaint ID.' },
  { path: '/track', label: 'Track Status', group: 'Citizen Portal', phase: 2, status: 'done', desc: 'Track applications, complaints and appointments by ID.' },
  { path: '/citizen/appointments', label: 'Book Appointment', group: 'Citizen Portal', phase: 2, status: 'done', desc: 'Book a demo slot at a government department.' },
  { path: '/citizen/verification', label: 'Document Verification', group: 'Citizen Portal', phase: 2, status: 'pending', desc: 'OCR-style document verification.' },
  { path: '/citizen/helpdesk', label: 'Helpdesk Chatbot', group: 'Citizen Portal', phase: 2, status: 'pending', desc: 'Citizen helpdesk assistant.' },

  { path: '/os/processes', label: 'Process & Threads', group: 'Process Management', phase: 3, status: 'pending', desc: 'Lifecycle, PCB and threads.' },
  { path: '/os/scheduling', label: 'CPU Scheduling', group: 'Process Management', phase: 3, status: 'pending', desc: 'FCFS, SJF, SRTF, Priority, RR with Gantt charts.' },
  { path: '/os/mlfq', label: 'MLFQ Simulation', group: 'Process Management', phase: 3, status: 'pending', desc: 'Multilevel feedback queue with aging.' },

  { path: '/os/synchronization', label: 'Synchronization', group: 'Sync & Deadlocks', phase: 4, status: 'pending', desc: 'Race condition, semaphores, classical problems.' },
  { path: '/os/deadlock', label: 'Deadlock', group: 'Sync & Deadlocks', phase: 4, status: 'pending', desc: "Banker's algorithm and resource allocation graph." },

  { path: '/os/memory', label: 'Memory Allocation', group: 'Memory Management', phase: 5, status: 'pending', desc: 'First/Best/Worst Fit, paging, segmentation.' },
  { path: '/os/page-replacement', label: 'Page Replacement', group: 'Memory Management', phase: 5, status: 'pending', desc: "FIFO, LRU, Optimal, LFU and Belady's anomaly." },

  { path: '/os/files', label: 'File Allocation', group: 'File & Disk', phase: 6, status: 'pending', desc: 'Contiguous, linked and indexed allocation.' },
  { path: '/os/disk', label: 'Disk Scheduling', group: 'File & Disk', phase: 6, status: 'pending', desc: 'FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK.' },

  { path: '/os/virtualization', label: 'Virtualization', group: 'Virtualization', phase: 7, status: 'pending', desc: 'KVM, VMs, Docker and CUDA architecture.' },
  { path: '/os/monitoring', label: 'System Monitoring', group: 'Virtualization', phase: 7, status: 'pending', desc: 'Simulated CPU, RAM and disk monitoring.' },
];

export const GROUPS = Array.from(new Set(NAV_ITEMS.map((n) => n.group)));
