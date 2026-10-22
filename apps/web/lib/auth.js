'use client';











const AUTH_USER_KEY = 'nexus_auth_user';
const AUTH_TOKEN_KEY = 'nexus_auth_token';

// Default demo customer for 1-click preview
export const DEMO_USERS = {
  customer: {
    id: 'user-rahul-sharma',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phoneNumber: '+91 9892019283',
    role: 'CUSTOMER',
    isPrimeMember: true,
    coinsBalance: 450,
    passwordHint: 'Password@123',
  },
  admin: {
    id: 'user-admin',
    name: 'NEXUS Operations Admin',
    email: 'admin@nexusmarket.in',
    phoneNumber: '+91 9876543210',
    role: 'ADMIN',
    isPrimeMember: true,
    coinsBalance: 1000,
    passwordHint: 'Password@123',
  },
  seller: {
    id: 'user-seller-apex',
    name: 'Vikram Singhania (Apex)',
    email: 'seller.apex@nexusmarket.in',
    phoneNumber: '+91 9820011223',
    role: 'SELLER',
    isPrimeMember: false,
    coinsBalance: 250,
    passwordHint: 'Password@123',
  },
};

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (err) {
    return null;
  }
}

export function isLoggedIn() {
  return getStoredUser() !== null;
}

export function setAuthSession(user, token) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    const tokenToSave = token || `demo_jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem(AUTH_TOKEN_KEY, tokenToSave);

    // Also set cookie so API & SSR can see token if needed
    document.cookie = `nexus_access_token=${tokenToSave}; path=/; max-age=604800; SameSite=Lax`;

    window.dispatchEvent(new Event('nexus-auth-updated'));
  } catch (err) {}
}

export function logout() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie = 'nexus_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

    // Optional API logout notification
    fetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {});

    window.dispatchEvent(new Event('nexus-auth-updated'));
  } catch (err) {}
}

const getApiBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  return env.replace(/\/+$/, '');
};

export async function loginWithCredentials(
  email,
  password
) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Try real API backend if available
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const u = json.data.user;
        const authUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          phoneNumber: u.phoneNumber,
          role: u.role,
          isPrimeMember: u.isPrimeMember ?? true,
          coinsBalance: 450,
        };
        setAuthSession(authUser, json.data.accessToken);
        return { success: true, user: authUser };
      }
    }
  } catch (err) {
    // API server offline or CORS, fallback to local client verification
  }

  // 2. Demo accounts validation
  if (cleanEmail === DEMO_USERS.customer.email.toLowerCase()) {
    if (password === 'Password@123' || password === 'password' || password.length >= 6) {
      const u = DEMO_USERS.customer;
      setAuthSession(u);
      return { success: true, user: u };
    }
  } else if (cleanEmail === DEMO_USERS.admin.email.toLowerCase()) {
    if (password === 'Password@123' || password === 'password' || password.length >= 6) {
      const u = DEMO_USERS.admin;
      setAuthSession(u);
      return { success: true, user: u };
    }
  }

  // 3. User might have registered previously in localStorage
  try {
    const savedUsersRaw = localStorage.getItem('nexus_registered_users');
    if (savedUsersRaw) {
      const savedUsers = JSON.parse(savedUsersRaw);
      const match = savedUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (match) {
        if (match.passwordHash === password || password.length >= 6) {
          const { passwordHash, ...safeUser } = match;
          setAuthSession(safeUser);
          return { success: true, user: safeUser };
        } else {
          return { success: false, message: 'Incorrect password entered.' };
        }
      }
    }
  } catch (e) {}

  // 4. If password is at least 6 characters, allow seamless direct login
  if (password.length >= 6) {
    const fallbackName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = fallbackName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const dynamicUser = {
      id: `usr-${Date.now()}`,
      name: formattedName || 'Nexus Member',
      email: cleanEmail,
      phoneNumber: '+91 9892000000',
      role: 'CUSTOMER',
      isPrimeMember: true,
      coinsBalance: 100,
    };
    setAuthSession(dynamicUser);
    return { success: true, user: dynamicUser };
  }

  return { success: false, message: 'Password must be at least 6 characters.' };
}

export async function registerWithCredentials(
  name,
  email,
  password,
  phoneNumber
) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Try real API backend
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        phoneNumber: phoneNumber ? phoneNumber.replace(/\D/g, '').slice(-10) : undefined,
        password,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const u = json.data.user;
        const authUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          phoneNumber,
          role: u.role,
          isPrimeMember: u.isPrimeMember ?? true,
          coinsBalance: 100,
        };
        setAuthSession(authUser, json.data.accessToken);
        return { success: true, user: authUser };
      }
    }
  } catch (err) {}

  // Local storage registration
  const newUser = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phoneNumber: phoneNumber || '+91 9800000000',
    role: 'CUSTOMER',
    isPrimeMember: true, // Welcome free prime month
    coinsBalance: 100, // Welcome coins
  };

  try {
    const savedUsersRaw = localStorage.getItem('nexus_registered_users');
    const savedUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    savedUsers.push({ ...newUser, passwordHash: password });
    localStorage.setItem('nexus_registered_users', JSON.stringify(savedUsers));
  } catch (e) {}

  setAuthSession(newUser);
  return { success: true, user: newUser };
}
