import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These are the PUBLIC keys — safe to expose in the browser.
// They are injected at build time via vite.config.ts `define`.
const supabaseUrl = import.meta.env.SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string;

let supabaseClient: any;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase env vars — using advanced mock client.');

  const getMockUsers = () => {
    try {
      const users = localStorage.getItem('mock_supabase_users');
      if (!users) {
        const defaultUsers = [
          { id: 'mock-admin-id_admin:true', email: 'admin@brightline.com', password: 'password123', is_admin: true },
          { id: 'mock-patient-id_admin:false', email: 'patient@example.com', password: 'password123', is_admin: false },
          { id: 'mock-owner-id_admin:true', email: 'enginebuild.io@gmail.com', password: 'password123', is_admin: true }
        ];
        localStorage.setItem('mock_supabase_users', JSON.stringify(defaultUsers));
        return defaultUsers;
      }
      return JSON.parse(users);
    } catch {
      return [];
    }
  };

  const saveMockUsers = (users: any[]) => {
    localStorage.setItem('mock_supabase_users', JSON.stringify(users));
  };

  const getMockSession = () => {
    try {
      const sessionStr = localStorage.getItem('mock_supabase_session');
      if (!sessionStr) return null;
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  };

  const saveMockSession = (session: any) => {
    if (session) {
      localStorage.setItem('mock_supabase_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('mock_supabase_session');
    }
  };

  const encodeMockToken = (user: any) => {
    const payload = {
      id: user.id,
      email: user.email,
      is_admin: !!user.is_admin
    };
    return 'mockjwt_' + encodeURIComponent(JSON.stringify(payload));
  };

  const listeners = new Set<(event: string, session: any) => void>();

  const triggerListeners = (event: string, session: any) => {
    listeners.forEach(cb => {
      try {
        cb(event, session);
      } catch (err) {
        console.error(err);
      }
    });
  };

  supabaseClient = {
    auth: {
      getSession: async () => {
        const session = getMockSession();
        return { data: { session }, error: null };
      },
      getUser: async () => {
        const session = getMockSession();
        return { data: { user: session?.user ?? null }, error: null };
      },
      onAuthStateChange: (cb: any) => {
        listeners.add(cb);
        const session = getMockSession();
        // Trigger immediately on subscription
        setTimeout(() => {
          cb('INITIAL_SESSION', session);
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners.delete(cb);
              }
            }
          }
        };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = getMockUsers();
        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
        }
        if (user.password !== password) {
          return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
        }
        
        const session = {
          access_token: encodeMockToken(user),
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          }
        };
        saveMockSession(session);
        triggerListeners('SIGNED_IN', session);
        return { data: { user: session.user, session }, error: null };
      },
      signUp: async ({ email, password }: any) => {
        const users = getMockUsers();
        if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          return { data: { user: null, session: null }, error: { message: 'User already exists' } };
        }
        const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'enginebuild.io@gmail.com';
        const newUser = {
          id: 'mock-user-' + Math.floor(100000 + Math.random() * 900000) + '_admin:' + isAdmin,
          email,
          password,
          is_admin: isAdmin
        };
        users.push(newUser);
        saveMockUsers(users);

        // Auto-signin after signup for ease of testing
        const session = {
          access_token: encodeMockToken(newUser),
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: newUser.id,
            email: newUser.email,
            created_at: new Date().toISOString()
          }
        };
        saveMockSession(session);
        triggerListeners('SIGNED_UP', session);
        return { data: { user: session.user, session }, error: null };
      },
      signOut: async () => {
        saveMockSession(null);
        triggerListeners('SIGNED_OUT', null);
        return { error: null };
      }
    },
    from: (table: string) => {
      return {
        select: (_columns: string) => {
          return {
            eq: (_colName: string, val: any) => {
              return {
                single: async () => {
                  if (table === 'profiles') {
                    const session = getMockSession();
                    if (session && session.user && session.user.id === val) {
                      const isAdmin = val.includes('admin:true') || (session.user.email && (session.user.email.toLowerCase().includes('admin') || session.user.email.toLowerCase() === 'enginebuild.io@gmail.com'));
                      return {
                        data: {
                          id: val,
                          is_admin: !!isAdmin,
                          created_at: session.user.created_at
                        },
                        error: null
                      };
                    }
                  }
                  return { data: null, error: { message: 'Not found' } };
                },
                order: () => {
                  return {
                    then: (cb: any) => cb({ data: [], error: null })
                  };
                }
              };
            },
            order: () => {
              return {
                then: (cb: any) => cb({ data: [], error: null })
              };
            }
          };
        }
      };
    }
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient as SupabaseClient;
