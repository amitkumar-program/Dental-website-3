/// <reference path="../types/express.d.ts" />
import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().min(1),
  preferred_date: z.string().min(1),
  message: z.string().optional(),
});

// POST /api/appointments — public (anonymous or authenticated)
router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      ...parsed.data,
      user_id: req.user?.id ?? null,
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ appointment: data });
});

// GET /api/appointments — authenticated users see their own
router.get('/', async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    // Fetch by user_id
    const { data: byUserId, error: err1 } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', req.user.id);

    // Fetch by email
    let byEmail: any[] = [];
    if (req.user.email) {
      const { data, error: err2 } = await supabase
        .from('appointments')
        .select('*')
        .eq('email', req.user.email);
      if (!err2 && data) {
        byEmail = data;
      }
    }

    if (err1 && byEmail.length === 0) {
      res.status(500).json({ error: err1.message });
      return;
    }

    const list1 = byUserId || [];
    const merged = [...list1];
    for (const item of byEmail) {
      if (!merged.some(m => String(m.id) === String(item.id))) {
        merged.push(item);
      }
    }

    // Sort by created_at descending
    merged.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    res.json({ appointments: merged });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve appointments' });
  }
});

// PATCH /api/appointments/:id/cancel — cancel own appointment
router.patch('/:id/cancel', async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Invalid appointment id' });
    return;
  }

  // Verify ownership (either by user_id OR by email)
  const { data: existing, error: fetchErr } = await supabase
    .from('appointments')
    .select('id, user_id, email, status')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  const isOwner = existing.user_id === req.user.id || 
                  (req.user.email && existing.email?.toLowerCase() === req.user.email.toLowerCase());

  if (!isOwner) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  if (existing.status === 'cancelled') {
    res.status(400).json({ error: 'Already cancelled' });
    return;
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ appointment: data });
});

export default router;
