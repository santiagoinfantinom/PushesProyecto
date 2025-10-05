import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

const PromptSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	category: z.string().nullable().optional(),
	is_favorite: z.boolean().optional(),
	tags: z.array(z.string()).nullable().optional(),
});

// GET - Fetch all prompts
export async function GET() {
	try {
		const supabase = getSupabaseServer();
		
		const { data: prompts, error } = await supabase
			.from('prompts')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ prompts: prompts || [] });
	} catch (error) {
		console.error('GET error:', error);
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}

// POST - Create a new prompt
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validated = PromptSchema.parse(body);

		const supabase = getSupabaseServer();

		const { data, error } = await supabase
			.from('prompts')
			.insert([validated])
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ prompt: data }, { status: 201 });
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

// PUT - Update a prompt
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, ...updates } = body;

		if (!id) {
			return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
		}

		const validated = PromptSchema.partial().parse(updates);

		const supabase = getSupabaseServer();

		const { data, error } = await supabase
			.from('prompts')
			.update(validated)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ prompt: data });
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

// DELETE - Delete a prompt
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
		}

		const supabase = getSupabaseServer();

		const { error } = await supabase
			.from('prompts')
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

