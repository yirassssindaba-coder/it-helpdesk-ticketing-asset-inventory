import { Router } from 'express';
import { db } from '../db';
import { tickets } from '../schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.post('/', async (req, res) => {
  try {
    const existing = await db.select({ ticketId: tickets.ticketId }).from(tickets).orderBy(desc(tickets.id)).limit(1);
    let nextNum = 1;
    if (existing.length > 0) {
      const last = parseInt(existing[0].ticketId.replace('TKT-', ''), 10);
      nextNum = isNaN(last) ? 1 : last + 1;
    }
    const ticketId = `TKT-${String(nextNum).padStart(3, '0')}`;

    const [row] = await db.insert(tickets).values({
      ticketId,
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'open',
      priority: req.body.priority || 'medium',
      category: req.body.category || 'Hardware',
      division: req.body.division || '',
      requesterName: req.body.requesterName,
      requesterEmail: req.body.requesterEmail || '',
      assignedTo: req.body.assignedTo || '',
      slaHours: req.body.slaHours || 24,
      resolutionNotes: req.body.resolutionNotes || '',
    }).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [row] = await db.update(tickets).set({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      category: req.body.category,
      division: req.body.division,
      requesterName: req.body.requesterName,
      requesterEmail: req.body.requesterEmail,
      assignedTo: req.body.assignedTo,
      slaHours: req.body.slaHours,
      resolutionNotes: req.body.resolutionNotes,
      updatedAt: new Date(),
    }).where(eq(tickets.id, id)).returning();
    if (!row) return res.status(404).json({ error: 'Ticket not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(tickets).where(eq(tickets.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

export default router;
