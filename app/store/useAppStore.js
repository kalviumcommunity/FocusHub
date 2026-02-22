import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate some default dummy data to initialize the store if it's empty
const initialTasks = [
    { id: "1", title: "Create a React app", progress: "4/6 • 100/150 mins", deadlineTime: "14:00", deadlineDate: "Today" },
    { id: "2", title: "Market Research & Analysis", progress: "3/5 • 80/120 mins", deadlineTime: "16:30", deadlineDate: "Tomorrow" },
];

const initialCompletedTasks = [
    { id: "3", title: "UI Design for Dashboard", progress: "Done", completedAt: "10:00 AM" },
];

// Initial Chats & Groups for Teams Tab
const initialChats = [
    {
        id: "chat_1",
        isGroup: false,
        name: "John Doe",
        number: "555-0192",
        avatar: "https://ui-avatars.com/api/?name=John+Doe",
        status: "online",
        messages: [
            { _id: "m1", text: "Hey! Let's sync up later.", createdAt: new Date().toISOString(), user: { _id: "2", name: "John Doe" } }
        ]
    }
];

const initialGroups = [
    {
        id: "group_1",
        isGroup: true,
        name: "React Avengers",
        description: "Frontend Superheroes",
        avatar: "https://ui-avatars.com/api/?name=React+Avengers&background=0D8ABC&color=fff",
        members: ["Tony Stark", "Steve Rogers"],
        messages: [
            { _id: "m2", text: "Who finished the dashboard?", createdAt: new Date().toISOString(), user: { _id: "3", name: "Tony Stark" } }
        ]
    }
];

export const useAppStore = create(
    persist(
        (set, get) => ({
            // --- USER PROFILE ---
            user: {
                name: "Andrew",
                email: "andrew@productivity.com",
                avatar: "https://ui-avatars.com/api/?name=Andrew&background=random&size=128",
                preferences: { notificationsEnabled: true, darkMode: false }
            },
            updateUser: (newData) => set((state) => ({ user: { ...state.user, ...newData } })),

            // --- TASKS ---
            activeTasks: initialTasks,
            completedTasks: initialCompletedTasks,
            addTask: (task) => set((state) => ({ activeTasks: [...state.activeTasks, task] })),
            removeTask: (taskId) => set((state) => ({
                activeTasks: state.activeTasks.filter(t => t.id !== taskId),
                completedTasks: state.completedTasks.filter(t => t.id !== taskId)
            })),
            completeTask: (taskId) => set((state) => {
                const task = state.activeTasks.find(t => t.id === taskId);
                if (!task) return state;
                return {
                    activeTasks: state.activeTasks.filter(t => t.id !== taskId),
                    completedTasks: [...state.completedTasks, { ...task, progress: "Done", completedAt: new Date().toLocaleTimeString() }]
                };
            }),

            // --- SESSIONS (Pomodoro Logs) ---
            recentSessions: [],
            addSession: (session) => set((state) => ({
                recentSessions: [session, ...state.recentSessions]
            })),

            // --- TEAMS / CHATS ---
            chats: initialChats,
            groups: initialGroups,

            addChat: (newChat) => set((state) => ({
                chats: [newChat, ...state.chats]
            })),

            addGroup: (newGroup) => set((state) => ({
                groups: [newGroup, ...state.groups]
            })),

            addMessageToThread: (threadId, message, isGroup = false) => set((state) => {
                const targetList = isGroup ? state.groups : state.chats;
                const updatedList = targetList.map((thread) => {
                    if (thread.id === threadId) {
                        return { ...thread, messages: [message, ...(thread.messages || [])] };
                    }
                    return thread;
                });

                return isGroup ? { groups: updatedList } : { chats: updatedList };
            }),

        }),
        {
            name: 'app-global-storage', // unique name for AsyncStorage key
            storage: createJSONStorage(() => AsyncStorage), // persist to device storage
        }
    )
);
