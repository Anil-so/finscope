import { NextRequest, NextResponse } from 'next/server';
import { SECService } from '@/lib/services/secService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);

    const result = await SECService.searchPaginatedCompanies(q, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error /api/sec/companies:', error);
    return NextResponse.json({ error: 'Failed to search SEC company registry' }, { status: 500 });
  }
}
