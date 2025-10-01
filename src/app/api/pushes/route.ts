import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServer } from '@/lib/supabase/server';

const PushSchema = z.object({
	github_link: z.string().url(),
	comment: z.string().min(1).max(1000)
});

export async function GET() {
	const supabase = getSupabaseServer();
	const { data, error } = await supabase
		.from('pushes')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(100);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ pushes: data ?? [] });
}

export async function POST(request: Request) {
	const body = await request.json();
	const parsed = PushSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const supabase = getSupabaseServer();
	const { data, error } = await supabase
		.from('pushes')
		.insert({ github_link: parsed.data.github_link, comment: parsed.data.comment })
		.select('*')
		.single();
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ push: data }, { status: 201 });
}
