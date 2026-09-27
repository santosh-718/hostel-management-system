import { Injectable } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

type UserRole = 'ADMIN' | 'USER';

@Injectable()
export class AuthService {
  private readonly dbFile =
    'db/users.json';

  private normalizeRole(
    role?: string,
  ): UserRole {
    const normalized =
      role?.toString().trim().toUpperCase();

    if (normalized === 'ADMIN') {
      return 'ADMIN';
    }

    return 'USER';
  }

  async login(
    email: string,
    password: string,
    role?: string,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          users: [],
        },
      );

    const requestedRole =
      this.normalizeRole(role);

    const user =
      db.data.users.find(
        (u: any) =>
          u.email === email &&
          u.password === password,
      );

    if (!user) {
      return {
        success: false,
        message:
          'Invalid Credentials',
      };
    }

    const userRole =
      this.normalizeRole(
        user.role,
      );

    if (
      userRole !== requestedRole
    ) {
      return {
        success: false,
        message:
          'Invalid role for this account',
      };
    }

    return {
      success: true,
      user: {
        ...user,
        role: userRole,
      },
    };
  }

  async register(
    userData: any,
  ) {
    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          users: [],
        },
      );

    const exists =
      db.data.users.find(
        (u: any) =>
          u.email === userData.email,
      );

    if (exists) {
      return {
        success: false,
        message:
          'Email already exists',
      };
    }

    const role =
      this.normalizeRole(
        userData.role,
      );

    db.data.users.push({
      userId:
        `USR${Date.now()}`,
      ...userData,
      role,
    });

    await db.write();

    return {
      success: true,
      message:
        'Registration Successful',
    };
  }
}
