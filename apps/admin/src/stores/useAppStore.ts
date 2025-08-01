import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户信息类型
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  permissions: string[];
}

// 应用状态类型
interface AppState {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // 系统状态
  isLoading: boolean;
  error: string | null;
  
  // 主题设置
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  
  // 侧边栏状态
  sidebarCollapsed: boolean;
  
  // 通知设置
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

// 应用操作类型
interface AppActions {
  // 认证相关
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  
  // 系统状态
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 主题设置
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
  
  // 侧边栏
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // 通知设置
  updateNotifications: (settings: Partial<AppState['notifications']>) => void;
  
  // 重置状态
  reset: () => void;
}

// 应用 Store
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,
      theme: 'light',
      language: 'zh-CN',
      sidebarCollapsed: false,
      notifications: {
        enabled: true,
        sound: true,
        desktop: true,
      },

      // 认证相关操作
      login: (user: User, token: string) => {
        localStorage.setItem('auth_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      // 系统状态操作
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      // 主题设置操作
      setTheme: (theme: 'light' | 'dark') => set({ theme }),

      setLanguage: (language: 'zh-CN' | 'en-US') => set({ language }),

      // 侧边栏操作
      toggleSidebar: () => {
        const { sidebarCollapsed } = get();
        set({ sidebarCollapsed: !sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

      // 通知设置操作
      updateNotifications: (settings) => {
        const { notifications } = get();
        set({
          notifications: { ...notifications, ...settings },
        });
      },

      // 重置状态
      reset: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isLoading: false,
          error: null,
          theme: 'light',
          language: 'zh-CN',
          sidebarCollapsed: false,
          notifications: {
            enabled: true,
            sound: true,
            desktop: true,
          },
        });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        notifications: state.notifications,
      }),
    }
  )
);

// 选择器函数
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useToken = () => useAppStore((state) => state.token);
export const useLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useNotifications = () => useAppStore((state) => state.notifications);

// 权限检查函数
export const useHasPermission = (permission: string) => {
  const user = useUser();
  return user?.permissions.includes(permission) || false;
};

export const useHasRole = (role: string) => {
  const user = useUser();
  return user?.role === role;
};

export default useAppStore; 