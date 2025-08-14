import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/queryClient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// Load user from localStorage on app start
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // First check localStorage
      const storedUser = localStorage.getItem('patent_hash_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Verify with server that session is still valid
        try {
          const response = await fetch('/api/auth/user', {
            credentials: 'include',
          });
          
          if (response.ok) {
            const serverUser = await response.json();
            return serverUser;
          } else {
            // Session expired, clear localStorage
            localStorage.removeItem('patent_hash_user');
            return null;
          }
        } catch {
          // Network error, use cached user
          return user;
        }
      }
      
      // No stored user, check server session
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const user = await response.json();
          localStorage.setItem('patent_hash_user', JSON.stringify(user));
          return user;
        }
      } catch {
        // Network error or not authenticated
      }
      
      return null;
    } catch (error) {
      return rejectWithValue('Failed to initialize authentication');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        return rejectWithValue(error || 'Login failed');
      }

      const user = await response.json();
      localStorage.setItem('patent_hash_user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        return rejectWithValue(error || 'Registration failed');
      }

      const user = await response.json();
      localStorage.setItem('patent_hash_user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      localStorage.removeItem('patent_hash_user');
      return null;
    } catch (error) {
      // Even if server request fails, clear local data
      localStorage.removeItem('patent_hash_user');
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isInitialized = true;
      localStorage.removeItem('patent_hash_user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;