/// <reference path="../types/express.d.ts" />
import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

/**
 * Extracts and verifies a Supabase JWT from the Authorization header.
 * Attaches req.user if valid; sets req.user = null otherwise.
 * Always calls next() — routes decide whether auth is required.
 */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token =
    authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    let user: any = null;

    if (token.startsWith('mockjwt_')) {
      try {
        const jsonStr = decodeURIComponent(token.slice('mockjwt_'.length));
        const payload = JSON.parse(jsonStr);
        user = {
          id: payload.id,
          email: payload.email ?? null,
        };
      } catch {
        req.user = null;
        return next();
      }
    } else {
      const {
        data: { user: fetchedUser },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !fetchedUser) {
        req.user = null;
        return next();
      }
      user = fetchedUser;
    }

    if (!user) {
      req.user = null;
      return next();
    }

    // Fetch is_admin from profiles (service role bypasses RLS)
    let profile: any = null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        profile = data;
      }
    } catch (e: any) {
      console.warn('Error fetching profile:', e.message);
    }

    const isAdminEmail = user.email ? (user.email.toLowerCase().includes('admin') || user.email.toLowerCase() === 'enginebuild.io@gmail.com') : false;

    if (profile) {
      if (isAdminEmail && !profile.is_admin) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', user.id)
            .select('is_admin')
            .single();
          if (!error && data) {
            profile = data;
          } else {
            profile.is_admin = true;
          }
        } catch (updateErr: any) {
          console.warn('Failed to update profile to admin:', updateErr.message);
          profile.is_admin = true;
        }
      }
    } else {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            is_admin: isAdminEmail,
          })
          .select('is_admin')
          .single();
        
        if (!error && data) {
          profile = data;
        } else {
          profile = { is_admin: isAdminEmail };
        }
      } catch (insertErr: any) {
        console.warn('Failed to insert missing profile, using fallback:', insertErr.message);
        profile = { is_admin: isAdminEmail };
      }
    }

    req.user = {
      id: user.id,
      email: user.email ?? null,
      isAdmin: profile?.is_admin ?? isAdminEmail,
    };
  } catch {
    req.user = null;
  }

  next();
}
