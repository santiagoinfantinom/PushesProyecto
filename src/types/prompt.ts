export interface Prompt {
	id: string;
	created_at: string;
	title: string;
	content: string;
	category: string | null;
	is_favorite: boolean;
	tags: string[] | null;
}


