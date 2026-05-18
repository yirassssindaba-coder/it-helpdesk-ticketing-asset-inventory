import { Router } from 'express';
import { db } from '../db';
import { assets } from '../schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await db.select().from(assets).orderBy(desc(assets.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

router.post('/', async (req, res) => {
  try {
    const existing = await db.select({ assetId: assets.assetId }).from(assets).orderBy(desc(assets.id)).limit(1);
    let nextNum = 1;
    if (existing.length > 0) {
      const last = parseInt(existing[0].assetId.replace('AST-', ''), 10);
      nextNum = isNaN(last) ? 1 : last + 1;
    }
    const assetId = `AST-${String(nextNum).padStart(3, '0')}`;

    const [row] = await db.insert(assets).values({
      assetId,
      name: req.body.name,
      category: req.body.category || 'laptop',
      status: req.body.status || 'active',
      serialNumber: req.body.serialNumber || '',
      purchaseDate: req.body.purchaseDate || '',
      warrantyExpiry: req.body.warrantyExpiry || '',
      assignedTo: req.body.assignedTo || '',
      department: req.body.department || '',
      location: req.body.location || '',
      licenseKey: req.body.licenseKey || '',
      licenseExpiry: req.body.licenseExpiry || '',
      notes: req.body.notes || '',
    }).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [row] = await db.update(assets).set({
      name: req.body.name,
      category: req.body.category,
      status: req.body.status,
      serialNumber: req.body.serialNumber,
      purchaseDate: req.body.purchaseDate,
      warrantyExpiry: req.body.warrantyExpiry,
      assignedTo: req.body.assignedTo,
      department: req.body.department,
      location: req.body.location,
      licenseKey: req.body.licenseKey,
      licenseExpiry: req.body.licenseExpiry,
      notes: req.body.notes,
      updatedAt: new Date(),
    }).where(eq(assets.id, id)).returning();
    if (!row) return res.status(404).json({ error: 'Asset not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(assets).where(eq(assets.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
