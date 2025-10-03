export interface Idea {
	id: string;
	created_at: string;
	title: string;
	description: string;
	status: 'idea' | 'in_progress' | 'completed' | 'on_hold';
	priority: 'low' | 'medium' | 'high';
	tags: string[] | null;
}

