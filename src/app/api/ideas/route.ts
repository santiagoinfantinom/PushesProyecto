import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

const IdeaSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	status: z.enum(['idea', 'in_progress', 'completed', 'on_hold']).optional(),
	priority: z.enum(['low', 'medium', 'high']).optional(),
	tags: z.array(z.string()).nullable().optional(),
});

// GET - Fetch all ideas
export async function GET() {
	try {
		const supabase = getSupabaseServer();
		
		const { data: ideas, error } = await supabase
			.from('ideas')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ ideas: ideas || [] });
	} catch (error) {
		console.error('GET error:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

// POST - Create a new idea
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validated = IdeaSchema.parse(body);

		const supabase = getSupabaseServer();

		const { data, error } = await supabase
			.from('ideas')
			.insert([validated])
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ idea: data }, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Datos inválidos', details: error.issues },
				{ status: 400 }
			);
		}
		console.error('POST error:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

// PUT - Update an idea
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, ...updates } = body;

		if (!id) {
			return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
		}

		const validated = IdeaSchema.partial().parse(updates);

		const supabase = getSupabaseServer();

		const { data, error } = await supabase
			.from('ideas')
			.update(validated)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ idea: data });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Datos inválidos', details: error.issues },
				{ status: 400 }
			);
		}
		console.error('PUT error:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

// DELETE - Delete an idea
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
		}

		const supabase = getSupabaseServer();

		const { error } = await supabase
			.from('ideas')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('DELETE error:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

