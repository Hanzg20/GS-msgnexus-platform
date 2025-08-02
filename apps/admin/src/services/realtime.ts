import { io, Socket } from 'socket.io-client';

export interface RealtimeMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  tenantId: string;
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'offline' | 'away';
  timestamp: string;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface SystemNotification {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}

class RealtimeService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event handlers
  private messageHandlers: ((message: RealtimeMessage) => void)[] = [];
  private statusHandlers: ((status: UserStatus) => void)[] = [];
  private typingHandlers: ((typing: TypingIndicator) => void)[] = [];
  private notificationHandlers: ((notification: SystemNotification) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io('http://localhost:3031', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 Connected to realtime service');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from realtime service');
      this.isConnected = false;
      this.notifyConnectionHandlers(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🔌 Max reconnection attempts reached');
      }
    });

    // Message events
    this.socket.on('new-message', (message: RealtimeMessage) => {
      console.log('💬 New message received:', message);
      this.notifyMessageHandlers(message);
    });

    this.socket.on('message-sent', (confirmation: any) => {
      console.log('✅ Message sent confirmation:', confirmation);
    });

    // Status events
    this.socket.on('user-status-changed', (status: UserStatus) => {
      console.log('👤 User status changed:', status);
      this.notifyStatusHandlers(status);
    });

    // Typing events
    this.socket.on('user-typing', (typing: TypingIndicator) => {
      console.log('⌨️ User typing:', typing);
      this.notifyTypingHandlers(typing);
    });

    // System events
    this.socket.on('system-notification', (notification: SystemNotification) => {
      console.log('🔧 System notification:', notification);
      this.notifyNotificationHandlers(notification);
    });

    this.socket.on('welcome', (data: any) => {
      console.log('👋 Welcome message:', data);
    });
  }

  // Public methods
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      if (this.isConnected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      this.socket.once('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public joinTenant(tenantId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-tenant', tenantId);
      console.log(`👥 Joined tenant: ${tenantId}`);
    } else {
      console.warn('Socket not connected, cannot join tenant');
    }
  }

  public sendMessage(data: {
    tenantId: string;
    senderId: string;
    content: string;
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', data);
      console.log('💬 Message sent:', data);
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }

  public updateStatus(data: {
    tenantId: string;
    userId: string;
    status: 'online' | 'offline' | 'away';
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update-status', data);
      console.log('👤 Status updated:', data);
    } else {
      console.warn('Socket not connected, cannot update status');
    }
  }

  public startTyping(data: {
    tenantId: string;
    userId: string;
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-start', data);
    }
  }

  public stopTyping(data: {
    tenantId: string;
    userId: string;
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-stop', data);
    }
  }

  public markMessageRead(data: {
    tenantId: string;
    messageId: string;
    userId: string;
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark-read', data);
      console.log('✅ Message marked as read:', data);
    }
  }

  public sendSystemEvent(data: {
    tenantId: string;
    type: string;
    message: string;
    severity?: 'info' | 'warning' | 'error';
  }) {
    if (this.socket && this.isConnected) {
      this.socket.emit('system-event', data);
      console.log('🔧 System event sent:', data);
    }
  }

  // Event handlers registration
  public onMessage(handler: (message: RealtimeMessage) => void) {
    this.messageHandlers.push(handler);
  }

  public onStatusChange(handler: (status: UserStatus) => void) {
    this.statusHandlers.push(handler);
  }

  public onTyping(handler: (typing: TypingIndicator) => void) {
    this.typingHandlers.push(handler);
  }

  public onNotification(handler: (notification: SystemNotification) => void) {
    this.notificationHandlers.push(handler);
  }

  public onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
  }

  // Event handlers notification
  private notifyMessageHandlers(message: RealtimeMessage) {
    this.messageHandlers.forEach(handler => handler(message));
  }

  private notifyStatusHandlers(status: UserStatus) {
    this.statusHandlers.forEach(handler => handler(status));
  }

  private notifyTypingHandlers(typing: TypingIndicator) {
    this.typingHandlers.forEach(handler => handler(typing));
  }

  private notifyNotificationHandlers(notification: SystemNotification) {
    this.notificationHandlers.forEach(handler => handler(notification));
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  // Utility methods
  public isConnectedToServer(): boolean {
    return this.isConnected;
  }

  public getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService; 