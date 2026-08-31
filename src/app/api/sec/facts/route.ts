import { NextRequest, NextResponse } from 'next/server';
import { SECService } from '@/lib/services/secService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cik = searchParams.get('cik');

    if (!cik) {
      return NextResponse.json({ error: 'Missing CIK parameter' }, { status: 400 });
    }

    const { metrics, history } = await SECService.getCompanyFactsPayload(cik);
    return NextResponse.json({
      cik,
      metrics,
      history,
      source: 'Official SEC EDGAR API (data.sec.gov)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error /api/sec/facts:', error);
    return NextResponse.json({ error: 'Failed to fetch SEC EDGAR facts' }, { status: 500 });
  }
}
