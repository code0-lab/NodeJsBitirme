import { Request } from 'express';

export function getQueryFromReq(req: Request): string {
  const qRaw = (req.query.q ?? req.query.search ?? '') as string;
  return String(qRaw).trim();
}

export function makeSafeRegex(q: string): RegExp {
  return new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

export function makeBlogSearchFilter(q: string) {
  const rx = makeSafeRegex(q);
  return {
    isPublished: true,
    $or: [
      { title: rx },
      { content: rx },
      { tags: { $in: [rx] } }
    ]
  };
}

export function normalizeLimit(limit?: any, max = 50, def = 20): number {
  const n = Number(limit ?? def);
  if (Number.isNaN(n) || n <= 0) return def;
  return Math.min(n, max);
}