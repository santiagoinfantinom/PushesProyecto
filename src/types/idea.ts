export interface Idea {
	id: string;
	title: string;
	description: string;
	status: 'idea' | 'in_progress' | 'completed' | 'on_hold';
	priority: 'low' | 'medium' | 'high';
	tags: string[];
	created_at: string;
	updated_at: string;
}
