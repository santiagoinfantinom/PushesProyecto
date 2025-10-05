export interface Idea {
	id: string;
	title: string;
	description: string;
	status: 'idea' | 'en_progreso' | 'completado' | 'en_pausa';
	priority: 'baja' | 'media' | 'alta';
	tags: string[];
	created_at: string;
	updated_at: string;
}
