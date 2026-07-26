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
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.json({ appointments: data });
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
    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
        .from('appointments')
        .select('id, user_id, status')
        .eq('id', id)
        .single();
    if (fetchErr || !existing) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
    }
    if (existing.user_id !== req.user.id) {
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
