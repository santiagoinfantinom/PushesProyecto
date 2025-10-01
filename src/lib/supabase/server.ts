import { createClient } from '@supabase/supabase-js';

export function getSupabaseServer() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;
	
	if (!url || !key) {
		console.error('Supabase configuration missing!');
		console.error('URL:', url ? 'present' : 'MISSING');
		console.error('KEY:', key ? 'present' : 'MISSING');
		throw new Error('Supabase URL or KEY not configured');
	}
	
	console.log('Creating Supabase client with URL:', url);
	return createClient(url, key);
}
