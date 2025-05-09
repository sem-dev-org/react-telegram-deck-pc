import { IUser } from '@/types/auth';
import { IUserStatus } from '@/types/auth';
import { logout } from '@/api/login';

export function signIn(response: { user: IUser; status: IUserStatus; username: string; token: string }) {
  sessionStorage.setItem('user', JSON.stringify(response.user));
  sessionStorage.setItem('status', JSON.stringify(response.status));
  sessionStorage.setItem('username', response.username);
  sessionStorage.setItem('token', response.token);
}

export function signUser(user: IUser) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

export function signStatus(status: IUserStatus) {
  sessionStorage.setItem('status', JSON.stringify(status));
}

export function signOut() {
  if (getUser() && getStatus()) {
    logout();
  }
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('status');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('token');
}

export function getUser() {
  return sessionStorage.getItem('user');
}

export function getStatus() {
  return sessionStorage.getItem('status');
}

export function getUsername() {
  return sessionStorage.getItem('username');
}

export function getToken() {
  return sessionStorage.getItem('token');
}