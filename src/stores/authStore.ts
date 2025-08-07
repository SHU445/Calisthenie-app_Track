import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { storage, generateId, validateEmail, validatePassword } from '@/lib/utils';

const USERS_STORAGE_KEY = 'calisthenie_users';

// Utilisateur de démonstration
const demoUser: User = {
  id: 'demo-user-id',
  username: 'demo',
  email: 'demo@calisthenie-tracker.com',
  password: 'demo123',
  dateCreation: new Date().toISOString(),
  preferences: {
    theme: 'dark',
    units: 'metric',
    language: 'fr'
  }
};

// Initialiser les utilisateurs avec le compte de démonstration
const initializeUsers = () => {
  const existingUsers: User[] = storage.get(USERS_STORAGE_KEY) || [];
  const demoExists = existingUsers.find(u => u.username === 'demo');
  
  if (!demoExists) {
    const updatedUsers = [...existingUsers, demoUser];
    storage.set(USERS_STORAGE_KEY, updatedUsers);
  }
};

interface AuthStore extends AuthState {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          // Initialiser les utilisateurs avec le compte de démonstration
          initializeUsers();
          
          // Récupérer les utilisateurs du localStorage
          const users: User[] = storage.get(USERS_STORAGE_KEY) || [];
          
          // Vérifier les identifiants
          const user = users.find(u => 
            (u.username === username || u.email === username) && u.password === password
          );
          
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ 
              error: 'Nom d\'utilisateur ou mot de passe incorrect',
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          set({ 
            error: 'Erreur lors de la connexion',
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      register: async (username: string, email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          // Validation des données
          if (!validateEmail(email)) {
            set({ 
              error: 'Adresse email invalide',
              isLoading: false 
            });
            return false;
          }

          const passwordValidation = validatePassword(password);
          if (!passwordValidation.isValid) {
            set({ 
              error: passwordValidation.errors[0],
              isLoading: false 
            });
            return false;
          }

          // Récupérer les utilisateurs existants
          const users: User[] = storage.get(USERS_STORAGE_KEY) || [];
          
          // Vérifier si l'utilisateur ou l'email existe déjà
          const existingUser = users.find(u => 
            u.username === username || u.email === email
          );
          
          if (existingUser) {
            const message = existingUser.username === username 
              ? 'Ce nom d\'utilisateur est déjà pris'
              : 'Cette adresse email est déjà utilisée';
            
            set({ 
              error: message,
              isLoading: false 
            });
            return false;
          }
          
          // Créer le nouveau utilisateur
          const newUser: User = {
            id: generateId(),
            username,
            email,
            password, // En production, il faudrait hasher le mot de passe
            dateCreation: new Date().toISOString(),
            preferences: {
              theme: 'dark',
              units: 'metric',
              language: 'fr'
            }
          };
          
          // Ajouter le nouvel utilisateur à la liste
          const updatedUsers = [...users, newUser];
          storage.set(USERS_STORAGE_KEY, updatedUsers);
          
          // Connecter automatiquement l'utilisateur
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return true;
        } catch (error) {
          set({ 
            error: 'Erreur lors de l\'inscription',
            isLoading: false 
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-store',
      // Ne persister que le user et isAuthenticated
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
); 