'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, ChefHat, Factory, Heart, Truck, Shield, ArrowRight } from 'lucide-react';
import { useRoleStore } from '@/store/role-store';
import { ROLES } from '@/lib/constants';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  kitchen_manager: ChefHat,
  plant_manager: Factory,
  ngo_receiver: Heart,
  logistics_driver: Truck,
  admin_auditor: Shield,
};

const roleColors: Record<UserRole, string> = {
  kitchen_manager: 'from-emerald-500 to-green-600',
  plant_manager: 'from-blue-500 to-indigo-600',
  ngo_receiver: 'from-rose-500 to-pink-600',
  logistics_driver: 'from-amber-500 to-orange-600',
  admin_auditor: 'from-purple-500 to-violet-600',
};

const roleBorderColors: Record<UserRole, string> = {
  kitchen_manager: 'hover:border-emerald-400 focus-visible:border-emerald-400',
  plant_manager: 'hover:border-blue-400 focus-visible:border-blue-400',
  ngo_receiver: 'hover:border-rose-400 focus-visible:border-rose-400',
  logistics_driver: 'hover:border-amber-400 focus-visible:border-amber-400',
  admin_auditor: 'hover:border-purple-400 focus-visible:border-purple-400',
};

export default function LoginPage() {
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FoodLoop AI</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Welcome to FoodLoop AI
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select your role to continue as a demo user. No login required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(ROLES) as [UserRole, (typeof ROLES)[keyof typeof ROLES]][]).map(
              ([role, config], index) => {
                const Icon = roleIcons[role];
                return (
                  <motion.button
                    key={role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      'group relative flex flex-col items-start rounded-xl border-2 border-border bg-card p-6 text-left transition-all duration-200',
                      'hover:shadow-lg hover:-translate-y-0.5',
                      roleBorderColors[role]
                    )}
                    aria-label={`Continue as ${config.label}`}
                  >
                    <div
                      className={cn(
                        'rounded-lg bg-gradient-to-br p-3 mb-4',
                        roleColors[role]
                      )}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-card-foreground mb-1">
                      {config.label}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {config.description}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Continue as demo user
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.button>
                );
              }
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-muted-foreground mt-8"
          >
            This is a demo environment with simulated data. No real authentication is required.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
