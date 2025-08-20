import * as fs from 'fs';
import * as path from 'path';

// 日志级别
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// 日志条目接口
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  socketId?: string;
  userId?: string;
  tenantId?: string;
  platform?: string;
  ip?: string;
  userAgent?: string;
  transport?: string;
  details: any;
  message: string;
}

class Logger {
  private logDir: string;
  private logFile: string;
  private maxLogSize: number = 10 * 1024 * 1024; // 10MB

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'realtime.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private rotateLogFile() {
    if (fs.existsSync(this.logFile)) {
      const stats = fs.statSync(this.logFile);
      if (stats.size > this.maxLogSize) {
        const backupFile = `${this.logFile}.${new Date().toISOString().replace(/[:.]/g, '-')}`;
        fs.renameSync(this.logFile, backupFile);
        console.log(`📁 日志文件已轮转: ${backupFile}`);
      }
    }
  }

  private writeLog(entry: LogEntry) {
    this.rotateLogFile();
    
    const logLine = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.logFile, logLine);
    
    // 同时输出到控制台
    const consoleMessage = `[${entry.timestamp}] ${entry.level} - ${entry.event}: ${entry.message}`;
    if (entry.level === LogLevel.ERROR) {
      console.error(consoleMessage);
    } else if (entry.level === LogLevel.WARN) {
      console.warn(consoleMessage);
    } else {
      console.log(consoleMessage);
    }
  }

  // 记录连接事件
  logConnection(socket: any, event: string, details: any = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      event: event,
      socketId: socket.id,
      userId: socket.handshake?.query?.userId,
      tenantId: socket.handshake?.query?.tenantId,
      platform: socket.handshake?.query?.platform,
      ip: socket.handshake?.address,
      userAgent: socket.handshake?.headers?.['user-agent'],
      transport: socket.conn?.transport?.name,
      details: details,
      message: `${event} - Socket: ${socket.id}, User: ${socket.handshake?.query?.userId || 'unknown'}, Tenant: ${socket.handshake?.query?.tenantId || 'unknown'}`
    };
    
    this.writeLog(entry);
  }

  // 记录断开连接事件
  logDisconnection(socket: any, reason: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      event: 'DISCONNECT',
      socketId: socket.id,
      userId: socket.handshake?.query?.userId,
      tenantId: socket.handshake?.query?.tenantId,
      platform: socket.handshake?.query?.platform,
      ip: socket.handshake?.address,
      userAgent: socket.handshake?.headers?.['user-agent'],
      transport: socket.conn?.transport?.name,
      details: { reason },
      message: `断开连接 - Socket: ${socket.id}, 原因: ${reason}`
    };
    
    this.writeLog(entry);
  }

  // 记录认证事件
  logAuthentication(socket: any, success: boolean, details: any = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: success ? LogLevel.INFO : LogLevel.WARN,
      event: success ? 'AUTH_SUCCESS' : 'AUTH_FAILED',
      socketId: socket.id,
      userId: socket.handshake?.query?.userId,
      tenantId: socket.handshake?.query?.tenantId,
      platform: socket.handshake?.query?.platform,
      ip: socket.handshake?.address,
      userAgent: socket.handshake?.headers?.['user-agent'],
      transport: socket.conn?.transport?.name,
      details: details,
      message: `${success ? '认证成功' : '认证失败'} - Socket: ${socket.id}, User: ${socket.handshake?.query?.userId || 'unknown'}`
    };
    
    this.writeLog(entry);
  }

  // 记录消息事件
  logMessage(socket: any, event: string, messageData: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      event: event,
      socketId: socket.id,
      userId: socket.handshake?.query?.userId,
      tenantId: socket.handshake?.query?.tenantId,
      platform: socket.handshake?.query?.platform,
      ip: socket.handshake?.address,
      userAgent: socket.handshake?.headers?.['user-agent'],
      transport: socket.conn?.transport?.name,
      details: messageData,
      message: `${event} - Socket: ${socket.id}, User: ${socket.handshake?.query?.userId || 'unknown'}, Content: ${messageData.content || 'N/A'}`
    };
    
    this.writeLog(entry);
  }

  // 记录错误事件
  logError(socket: any, error: any, context: string = '') {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      event: 'ERROR',
      socketId: socket?.id,
      userId: socket?.handshake?.query?.userId,
      tenantId: socket?.handshake?.query?.tenantId,
      platform: socket?.handshake?.query?.platform,
      ip: socket?.handshake?.address,
      userAgent: socket?.handshake?.headers?.['user-agent'],
      transport: socket?.conn?.transport?.name,
      details: { 
        error: error.message || error,
        stack: error.stack,
        context 
      },
      message: `错误 - ${context}: ${error.message || error}`
    };
    
    this.writeLog(entry);
  }

  // 记录房间事件
  logRoomEvent(socket: any, event: string, roomId: string, details: any = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      event: event,
      socketId: socket.id,
      userId: socket.handshake?.query?.userId,
      tenantId: socket.handshake?.query?.tenantId,
      platform: socket.handshake?.query?.platform,
      ip: socket.handshake?.address,
      userAgent: socket.handshake?.headers?.['user-agent'],
      transport: socket.conn?.transport?.name,
      details: { roomId, ...details },
      message: `${event} - Socket: ${socket.id}, Room: ${roomId}, User: ${socket.handshake?.query?.userId || 'unknown'}`
    };
    
    this.writeLog(entry);
  }

  // 记录系统事件
  logSystemEvent(event: string, details: any = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      event: event,
      details: details,
      message: `系统事件: ${event}`
    };
    
    this.writeLog(entry);
  }

  // 获取日志文件路径
  getLogFilePath(): string {
    return this.logFile;
  }

  // 获取日志统计信息
  getLogStats() {
    if (fs.existsSync(this.logFile)) {
      const stats = fs.statSync(this.logFile);
      const content = fs.readFileSync(this.logFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      return {
        fileSize: stats.size,
        totalLines: lines.length,
        lastModified: stats.mtime,
        logFile: this.logFile
      };
    }
    
    return {
      fileSize: 0,
      totalLines: 0,
      lastModified: null,
      logFile: this.logFile
    };
  }
}

export const logger = new Logger(); 