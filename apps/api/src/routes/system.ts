import express from 'express';
import os from 'os';

const router = express.Router();

// 系统指标接口
interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
  };
  uptime: number;
  platform: string;
  nodeVersion: string;
  processMemory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
}

// 获取系统概览
router.get('/overview', (req, res) => {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // 模拟CPU使用率（实际项目中应该使用真实的CPU监控库）
    const cpuUsage = Math.floor(Math.random() * 30) + 20; // 20-50%
    
    const metrics: SystemMetrics = {
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        loadAverage: os.loadavg()
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usage: Math.round((usedMem / totalMem) * 100)
      },
      disk: {
        total: 1000000000000, // 1TB (模拟)
        used: 600000000000,   // 600GB (模拟)
        free: 400000000000,   // 400GB (模拟)
        usage: 60
      },
      network: {
        bytesIn: Math.floor(Math.random() * 1000000000) + 500000000,
        bytesOut: Math.floor(Math.random() * 500000000) + 200000000,
        connections: Math.floor(Math.random() * 1000) + 500
      },
      uptime: os.uptime(),
      platform: os.platform(),
      nodeVersion: process.version,
      processMemory: process.memoryUsage()
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取系统概览失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取CPU详细信息
router.get('/cpu', (req, res) => {
  try {
    const cpus = os.cpus();
    const cpuUsage = Math.floor(Math.random() * 30) + 20;
    
    const cpuInfo = {
      model: cpus[0].model,
      cores: cpus.length,
      speed: cpus[0].speed,
      usage: cpuUsage,
      loadAverage: os.loadavg(),
      temperature: Math.floor(Math.random() * 20) + 40, // 40-60°C (模拟)
      coresDetail: cpus.map((cpu, index) => ({
        core: index,
        model: cpu.model,
        speed: cpu.speed,
        usage: Math.floor(Math.random() * 40) + 10
      }))
    };

    res.json({
      success: true,
      data: cpuInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取CPU信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取内存详细信息
router.get('/memory', (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    const memoryInfo = {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      available: freeMem,
      usage: Math.round((usedMem / totalMem) * 100),
      swap: {
        total: 0, // 实际项目中应该获取swap信息
        used: 0,
        free: 0
      },
      buffers: Math.floor(Math.random() * 100000000), // 模拟
      cached: Math.floor(Math.random() * 200000000),  // 模拟
      processMemory: process.memoryUsage()
    };

    res.json({
      success: true,
      data: memoryInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取内存信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取磁盘信息
router.get('/disk', (req, res) => {
  try {
    // 模拟磁盘信息（实际项目中应该使用真实的磁盘监控库）
    const diskInfo = {
      partitions: [
        {
          device: '/dev/sda1',
          mountpoint: '/',
          filesystem: 'ext4',
          total: 1000000000000, // 1TB
          used: 600000000000,   // 600GB
          free: 400000000000,   // 400GB
          usage: 60,
          readSpeed: Math.floor(Math.random() * 100) + 50,  // MB/s
          writeSpeed: Math.floor(Math.random() * 50) + 20   // MB/s
        },
        {
          device: '/dev/sdb1',
          mountpoint: '/data',
          filesystem: 'ext4',
          total: 2000000000000, // 2TB
          used: 1200000000000,  // 1.2TB
          free: 800000000000,   // 800GB
          usage: 60,
          readSpeed: Math.floor(Math.random() * 100) + 50,
          writeSpeed: Math.floor(Math.random() * 50) + 20
        }
      ],
      total: {
        total: 3000000000000,
        used: 1800000000000,
        free: 1200000000000,
        usage: 60
      },
      ioStats: {
        readBytes: Math.floor(Math.random() * 1000000000000) + 500000000000,
        writeBytes: Math.floor(Math.random() * 500000000000) + 200000000000,
        readCount: Math.floor(Math.random() * 10000000) + 5000000,
        writeCount: Math.floor(Math.random() * 5000000) + 2000000
      }
    };

    res.json({
      success: true,
      data: diskInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取磁盘信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取网络信息
router.get('/network', (req, res) => {
  try {
    const networkInterfaces = os.networkInterfaces();
    
    const networkInfo = {
      interfaces: Object.keys(networkInterfaces).map(name => {
        const interfaces = networkInterfaces[name];
        if (!interfaces) return null;
        
        const networkInterface = interfaces.find(iface => !iface.internal && iface.family === 'IPv4');
        if (!networkInterface) return null;
        
        return {
          name,
          address: networkInterface.address,
          netmask: networkInterface.netmask,
          mac: networkInterface.mac,
          family: networkInterface.family,
          cidr: networkInterface.cidr
        };
      }).filter(Boolean),
      stats: {
        bytesIn: Math.floor(Math.random() * 1000000000000) + 500000000000,
        bytesOut: Math.floor(Math.random() * 500000000000) + 200000000000,
        packetsIn: Math.floor(Math.random() * 1000000000) + 500000000,
        packetsOut: Math.floor(Math.random() * 500000000) + 200000000,
        errorsIn: Math.floor(Math.random() * 1000),
        errorsOut: Math.floor(Math.random() * 1000),
        droppedIn: Math.floor(Math.random() * 500),
        droppedOut: Math.floor(Math.random() * 500)
      },
      connections: {
        established: Math.floor(Math.random() * 1000) + 500,
        listening: Math.floor(Math.random() * 100) + 50,
        timeWait: Math.floor(Math.random() * 200) + 100,
        closeWait: Math.floor(Math.random() * 50) + 10
      }
    };

    res.json({
      success: true,
      data: networkInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取网络信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取进程信息
router.get('/processes', (req, res) => {
  try {
    // 模拟进程信息（实际项目中应该使用真实的进程监控库）
    const processes = [
      {
        pid: 1,
        name: 'systemd',
        cpu: 0.5,
        memory: 50000000, // 50MB
        status: 'running',
        user: 'root',
        command: '/sbin/init'
      },
      {
        pid: 1234,
        name: 'node',
        cpu: 15.2,
        memory: 150000000, // 150MB
        status: 'running',
        user: 'msgnexus',
        command: 'node dist/index-simple.js'
      },
      {
        pid: 5678,
        name: 'nginx',
        cpu: 2.1,
        memory: 30000000, // 30MB
        status: 'running',
        user: 'www-data',
        command: 'nginx: master process'
      },
      {
        pid: 9012,
        name: 'postgres',
        cpu: 8.7,
        memory: 200000000, // 200MB
        status: 'running',
        user: 'postgres',
        command: 'postgres'
      },
      {
        pid: 3456,
        name: 'redis-server',
        cpu: 1.3,
        memory: 25000000, // 25MB
        status: 'running',
        user: 'redis',
        command: 'redis-server'
      }
    ];

    const processStats = {
      total: processes.length,
      running: processes.filter(p => p.status === 'running').length,
      sleeping: processes.filter(p => p.status === 'sleeping').length,
      stopped: processes.filter(p => p.status === 'stopped').length,
      zombie: processes.filter(p => p.status === 'zombie').length,
      totalCpu: processes.reduce((sum, p) => sum + p.cpu, 0),
      totalMemory: processes.reduce((sum, p) => sum + p.memory, 0)
    };

    res.json({
      success: true,
      data: {
        processes,
        stats: processStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取进程信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取系统日志
router.get('/logs', (req, res) => {
  try {
    const { level = 'all', limit = 100, startDate, endDate } = req.query;
    
    // 模拟系统日志（实际项目中应该从真实的日志文件或数据库读取）
    const mockLogs = [
      {
        id: 'log-001',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: '系统启动完成',
        source: 'system',
        details: { uptime: '2.5s', memory: '1.2GB' }
      },
      {
        id: 'log-002',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'info',
        message: 'API服务器启动成功',
        source: 'api',
        details: { port: 3030, pid: 1234 }
      },
      {
        id: 'log-003',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        level: 'warning',
        message: '内存使用率较高',
        source: 'monitor',
        details: { usage: '85%', threshold: '80%' }
      },
      {
        id: 'log-004',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        level: 'error',
        message: '数据库连接失败',
        source: 'database',
        details: { error: 'Connection timeout', retries: 3 }
      },
      {
        id: 'log-005',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'info',
        message: '消息队列处理完成',
        source: 'queue',
        details: { processed: 150, failed: 2 }
      }
    ];

    let filteredLogs = [...mockLogs];

    // 按级别过滤
    if (level !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    // 按日期范围过滤
    if (startDate || endDate) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        if (startDate && logDate < new Date(startDate as string)) return false;
        if (endDate && logDate > new Date(endDate as string)) return false;
        return true;
      });
    }

    // 限制数量
    const limitNum = parseInt(limit as string);
    filteredLogs = filteredLogs.slice(0, limitNum);

    res.json({
      success: true,
      data: {
        logs: filteredLogs,
        total: mockLogs.length,
        filtered: filteredLogs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取系统日志失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取性能指标
router.get('/performance', (req, res) => {
  try {
    const { period = '1h' } = req.query;
    
    // 模拟性能指标数据（实际项目中应该从监控系统获取）
    const performanceData = {
      responseTime: {
        avg: Math.floor(Math.random() * 50) + 20, // 20-70ms
        p95: Math.floor(Math.random() * 100) + 50, // 50-150ms
        p99: Math.floor(Math.random() * 200) + 100, // 100-300ms
        max: Math.floor(Math.random() * 500) + 200  // 200-700ms
      },
      throughput: {
        requestsPerSecond: Math.floor(Math.random() * 1000) + 500, // 500-1500 req/s
        bytesPerSecond: Math.floor(Math.random() * 10000000) + 5000000, // 5-15 MB/s
        errorsPerSecond: Math.floor(Math.random() * 10) + 1 // 1-11 errors/s
      },
      errors: {
        total: Math.floor(Math.random() * 1000) + 100,
        rate: Math.floor(Math.random() * 5) + 1, // 1-6%
        byType: {
          '4xx': Math.floor(Math.random() * 500) + 50,
          '5xx': Math.floor(Math.random() * 200) + 20,
          'timeout': Math.floor(Math.random() * 100) + 10,
          'connection': Math.floor(Math.random() * 50) + 5
        }
      },
      resources: {
        cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
        memoryUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
        diskUsage: Math.floor(Math.random() * 20) + 50, // 50-70%
        networkUsage: Math.floor(Math.random() * 60) + 20 // 20-80%
      }
    };

    res.json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取性能指标失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取告警信息
router.get('/alerts', (req, res) => {
  try {
    const { status = 'all', severity = 'all' } = req.query;
    
    // 模拟告警数据（实际项目中应该从告警系统获取）
    const mockAlerts = [
      {
        id: 'alert-001',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        severity: 'critical',
        status: 'active',
        title: 'CPU使用率过高',
        message: 'CPU使用率已达到95%，超过阈值90%',
        source: 'cpu-monitor',
        metric: 'cpu_usage',
        value: 95,
        threshold: 90,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null
      },
      {
        id: 'alert-002',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        severity: 'warning',
        status: 'active',
        title: '内存使用率较高',
        message: '内存使用率已达到85%，接近阈值90%',
        source: 'memory-monitor',
        metric: 'memory_usage',
        value: 85,
        threshold: 90,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null
      },
      {
        id: 'alert-003',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        severity: 'info',
        status: 'resolved',
        title: '磁盘空间不足',
        message: '磁盘使用率已达到80%',
        source: 'disk-monitor',
        metric: 'disk_usage',
        value: 80,
        threshold: 85,
        acknowledged: true,
        acknowledgedBy: 'admin',
        acknowledgedAt: new Date(Date.now() - 800000).toISOString()
      }
    ];

    let filteredAlerts = [...mockAlerts];

    // 按状态过滤
    if (status !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }

    // 按严重程度过滤
    if (severity !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }

    const alertStats = {
      total: mockAlerts.length,
      active: mockAlerts.filter(a => a.status === 'active').length,
      resolved: mockAlerts.filter(a => a.status === 'resolved').length,
      critical: mockAlerts.filter(a => a.severity === 'critical').length,
      warning: mockAlerts.filter(a => a.severity === 'warning').length,
      info: mockAlerts.filter(a => a.severity === 'info').length
    };

    res.json({
      success: true,
      data: {
        alerts: filteredAlerts,
        stats: alertStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取告警信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 确认告警
router.post('/alerts/:id/acknowledge', (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledgedBy } = req.body;

    // 模拟确认告警（实际项目中应该更新数据库）
    res.json({
      success: true,
      message: '告警已确认',
      data: {
        id,
        acknowledged: true,
        acknowledgedBy,
        acknowledgedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '确认告警失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取系统健康状态
router.get('/health', (req, res) => {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = Math.round((usedMem / totalMem) * 100);
    
    // 模拟CPU使用率
    const cpuUsage = Math.floor(Math.random() * 30) + 20;
    
    const healthStatus = {
      overall: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: os.uptime(),
      checks: {
        cpu: {
          status: cpuUsage < 80 ? 'healthy' : cpuUsage < 90 ? 'warning' : 'critical',
          value: cpuUsage,
          threshold: 80
        },
        memory: {
          status: memoryUsage < 80 ? 'healthy' : memoryUsage < 90 ? 'warning' : 'critical',
          value: memoryUsage,
          threshold: 80
        },
        disk: {
          status: 'healthy',
          value: 60, // 模拟
          threshold: 85
        },
        network: {
          status: 'healthy',
          value: 30, // 模拟
          threshold: 80
        },
        database: {
          status: 'healthy',
          value: 0, // 模拟连接数
          threshold: 100
        }
      },
      services: {
        api: 'running',
        database: 'running',
        redis: 'running',
        nginx: 'running'
      }
    };

    // 确定整体状态
    const checkStatuses = Object.values(healthStatus.checks).map(check => check.status);
    if (checkStatuses.includes('critical')) {
      healthStatus.overall = 'critical';
    } else if (checkStatuses.includes('warning')) {
      healthStatus.overall = 'warning';
    }

    res.json({
      success: true,
      data: healthStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取系统健康状态失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 