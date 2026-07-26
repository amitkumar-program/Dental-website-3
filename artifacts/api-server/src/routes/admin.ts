/// <reference path="../types/express.d.ts" />
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { inMemoryWellnessSubscriptions } from './wellnessSubscriptions.js';

const router = Router();

/**
 * Hard guard: user must be authenticated AND have is_admin = true in the database.
 * The is_admin flag can only be set via the service-role key — never by users themselves.
 */
function requireAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (!req.user.isAdmin) {
    // Return 404 instead of 403 to avoid revealing that the endpoint exists
    res.status(404).json({ error: 'Not found' });
    return;
  }
  next();
}

// GET /api/admin/appointments — all appointments
router.get('/appointments', requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ appointments: data });
});

// PATCH /api/admin/appointments/:id/status — update appointment status (confirm or cancel)
router.patch('/appointments/:id/status', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Invalid appointment id' });
    return;
  }

  const { status } = req.body;
  if (status !== 'confirmed' && status !== 'cancelled' && status !== 'pending') {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ appointment: data });
});

// GET /api/admin/patients — all profiles + emails via auth admin API
router.get('/patients', requireAdmin, async (_req, res) => {
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, is_admin, created_at')
    .order('created_at', { ascending: false });

  if (profErr) {
    res.status(500).json({ error: profErr.message });
    return;
  }

  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });

  if (usersErr) {
    res.json({ patients: profiles });
    return;
  }

  const emailMap: Record<string, string | undefined> = {};
  for (const u of usersData.users) {
    emailMap[u.id] = u.email;
  }

  // Never expose the admin account email to the patients list response
  const patients = (profiles ?? [])
    .filter((p) => !p.is_admin)
    .map((p) => ({
      ...p,
      email: emailMap[p.id] ?? null,
    }));

  res.json({ patients });
});

// GET /api/admin/wellness-subscriptions — all membership bookings (subscriptions)
router.get('/wellness-subscriptions', requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('wellness_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    // Merging DB and memory storage (without duplicates, using id or filtering)
    const dbData = data || [];
    const merged = [...dbData];

    // Add any in-memory subscriptions that aren't in the database
    for (const inMem of inMemoryWellnessSubscriptions) {
      if (!merged.some(m => String(m.id) === String(inMem.id))) {
        merged.push(inMem);
      }
    }

    // Sort by created_at descending
    merged.sort((a, b) => {
      const dateA = new Date(a.created_at || a.dob).getTime();
      const dateB = new Date(b.created_at || b.dob).getTime();
      return dateB - dateA;
    });

    res.json({ subscriptions: merged });
  } catch (err: any) {
    console.warn('[Backend] Wellness admin fetch failed, falling back to in-memory store:', err.message);
    res.json({ subscriptions: inMemoryWellnessSubscriptions });
  }
});

export default router;
