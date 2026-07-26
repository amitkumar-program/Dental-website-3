import { supabase } from '../lib/supabase.js';
/**
 * Extracts and verifies a Supabase JWT from the Authorization header.
 * Attaches req.user if valid; sets req.user = null otherwise.
 * Always calls next() — routes decide whether auth is required.
 */
export async function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const { data: { user }, error, } = await supabase.auth.getUser(token);
        if (error || !user) {
            req.user = null;
            return next();
        }
        // Fetch is_admin from profiles (service role bypasses RLS)
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
        req.user = {
            id: user.id,
            email: user.email ?? null,
            isAdmin: profile?.is_admin ?? false,
        };
    }
    catch {
        req.user = null;
    }
    next();
}
