import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 注册路由
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // 验证密码是否匹配
    if (password !== confirmPassword) {
      return res.status(400).json({ message: '密码不匹配' });
    }

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码必填' });
    }

    // 检查邮箱是否已存在
    const existingUsersByEmail = await db.select('users', { email });
    if (existingUsersByEmail.length > 0) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = await db.insert('users', {
      email,
      password: hashedPassword,
    });

    // 生成JWT令牌
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败' });
  }
});

// 登录路由
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码必填' });
    }

    // 查找用户（通过邮箱）
    const foundUsers = await db.select('users', { email });

    if (foundUsers.length === 0) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const user = foundUsers[0];

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败' });
  }
});

// 获取当前用户信息路由
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: '未提供令牌' });
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // 查找用户
    const foundUsers = await db.select('users', { id: decoded.userId });

    if (foundUsers.length === 0) {
      return res.status(401).json({ success: false, message: '用户不存在' });
    }

    const user = foundUsers[0];

    res.status(200).json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(401).json({ success: false, message: '令牌无效' });
  }
});

export default router;