import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthState, User } from '../types';


interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // En un caso real, validarías el token con el servidor
      // Por ahora, simularemos un usuario autenticado
      const mockUser: User = {
        id: '1',
        nombre: 'Juan Pérez',
        email: 'admin@autotaller.com',
        telefono: '+1234567890',
        rol: 'administrador',
        activo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulación de llamada a API - en producción usar axios con endpoints reales
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@autotaller.com' && password === 'admin123') {
        const user: User = {
          id: '1',
          nombre: 'Juan Pérez',
          email: 'admin@autotaller.com',
          telefono: '+1234567890',
          rol: 'administrador',
          activo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const token = 'mock-jwt-token';
        
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } else if (email === 'recepcionista@autotaller.com' && password === 'recep123') {
        const user: User = {
          id: '2',
          nombre: 'María González',
          email: 'recepcionista@autotaller.com',
          telefono: '+1234567891',
          rol: 'recepcionista',
          activo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const token = 'mock-jwt-token-recep';
        
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } else if (email === 'mecanico@autotaller.com' && password === 'mec123') {
        const user: User = {
          id: '3',
          nombre: 'Carlos Rodríguez',
          email: 'mecanico@autotaller.com',
          telefono: '+1234567892',
          rol: 'mecanico',
          activo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const token = 'mock-jwt-token-mec';
        
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}