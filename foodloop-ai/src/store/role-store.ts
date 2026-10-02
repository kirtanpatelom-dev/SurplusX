import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, User } from '@/types';
import { MOCK_USERS } from '@/lib/constants';

interface RoleState {
  /** Currently selected role */
  currentRole: UserRole;
  /** Current user derived from role */
  currentUser: User;
  /** Whether the user has "logged in" (selected a role) */
  isLoggedIn: boolean;
  /** Set role and update user accordingly */
  setRole: (role: UserRole) => void;
  /** Log out and return to role selection */
  logout: () => void;
}

function getUserForRole(role: UserRole): User {
  const mockUser = MOCK_USERS[role];
  return {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role,
    organization: mockUser.organization,
  };
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      currentRole: 'kitchen_manager',
      currentUser: getUserForRole('kitchen_manager'),
      isLoggedIn: false,

      setRole: (role: UserRole) =>
        set({
          currentRole: role,
          currentUser: getUserForRole(role),
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
        }),
    }),
    {
      name: 'surplusx-role',
    }
  )
);
