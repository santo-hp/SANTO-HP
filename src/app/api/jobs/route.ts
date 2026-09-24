import { NextRequest, NextResponse } from 'next/server';
import { searchJobs } from '@/lib/job-catalog';
import { routing } from '@/i18n/routing';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requestedLocale = params.get('locale') || 'ja';
  const locale = routing.locales.find(value => value === requestedLocale) || 'ja';
  return NextResponse.json(await searchJobs(params, locale));
}
