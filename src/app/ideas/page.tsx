'use client';

import { useEffect, useState } from 'react';
import type { Idea } from '@/types/idea';

const statusColors = {
	idea: 'bg-gray-50 text-gray-900 border-gray-400',
	in_progress: 'bg-blue-50 text-blue-900 border-blue-400',
	completed: 'bg-green-50 text-green-900 border-green-400',
	on_hold: 'bg-yellow-50 text-yellow-900 border-yellow-400',
};

const statusLabels = {
	idea: 'Idea',
	in_progress: 'En Progreso',
	completed: 'Completado',
	on_hold: 'En Pausa',
};

const priorityColors = {
	low: 'bg-green-200 text-green-900 font-semibold',
	medium: 'bg-yellow-200 text-yellow-900 font-semibold',
	high: 'bg-red-200 text-red-900 font-semibold',
};

const priorityLabels = {
	low: 'Baja',
	medium: 'Media',
	high: 'Alta',
};

export default function IdeasPage() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState<Idea['status']>('idea');
	const [priority, setPriority] = useState<Idea['priority']>('media');
	const [tags, setTags] = useState('');
	const [loading, setLoading] = useState(false);
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loadingHistory, setLoadingHistory] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('');
	const [filterPriority, setFilterPriority] = useState('');
	const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
	const [showForm, setShowForm] = useState(false);

	async function loadIdeas() {
		setLoadingHistory(true);
		setError(null);
		try {
			const res = await fetch('/api/ideas', {
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}

			const data = await res.json();

			if (data.ideas) {
				setIdeas(data.ideas);
				setFilteredIdeas(data.ideas);
			} else {
				setIdeas([]);
				setFilteredIdeas([]);
			}
		} catch (err) {
			console.error('Error loading ideas:', err);
			setError(`Error cargando ideas: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoadingHistory(false);
		}
	}

	useEffect(() => {
		loadIdeas();
	}, []);

	// Filter ideas
	useEffect(() => {
		let filtered = ideas;

		if (searchQuery) {
			filtered = filtered.filter(idea =>
				idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				idea.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (filterStatus) {
			filtered = filtered.filter(idea => idea.status === filterStatus);
		}

		if (filterPriority) {
			filtered = filtered.filter(idea => idea.priority === filterPriority);
		}

		setFilteredIdeas(filtered);
	}, [searchQuery, filterStatus, filterPriority, ideas]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const tagsArray = tags.trim() ? tags.split(',').map(t => t.trim()) : [];

			const method = editingIdea ? 'PUT' : 'POST';
			const body = editingIdea
				? { id: editingIdea.id, title, description, status, priority, tags: tagsArray.length > 0 ? tagsArray : null }
				: { title, description, status, priority, tags: tagsArray.length > 0 ? tagsArray : null };

			const res = await fetch('/api/ideas', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(typeof data.error === 'string' ? data.error : `HTTP ${res.status}`);
			}

			// Clear form
			setTitle('');
			setDescription('');
			setStatus('idea');
			setPriority('medium');
			setTags('');
			setEditingIdea(null);
			setShowForm(false);

			// Reload history
			await loadIdeas();

		} catch (err) {
			console.error('Error saving idea:', err);
			setError(`Error guardando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoading(false);
		}
	}

	async function deleteIdea(id: string) {
		if (!confirm('¿Estás seguro de que quieres eliminar esta idea?')) {
			return;
		}

		try {
			const res = await fetch(`/api/ideas?id=${id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error eliminando');
			}

			await loadIdeas();
		} catch (err) {
			console.error('Error deleting idea:', err);
			setError(`Error eliminando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		}
	}

	function editIdea(idea: Idea) {
		setEditingIdea(idea);
		setTitle(idea.title);
		setDescription(idea.description);
		setStatus(idea.status);
		setPriority(idea.priority);
		setTags(idea.tags?.join(', ') || '');
		setShowForm(true);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancelEdit() {
		setEditingIdea(null);
		setTitle('');
		setDescription('');
		setStatus('idea');
		setPriority('medium');
		setTags('');
		setShowForm(false);
	}

	async function updateStatus(idea: Idea, newStatus: Idea['status']) {
		try {
			const res = await fetch('/api/ideas', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: idea.id, status: newStatus })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error actualizando');
			}

			await loadIdeas();
		} catch (err) {
			console.error('Error updating status:', err);
			setError(`Error actualizando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		}
	}

	const statusCounts = {
		idea: ideas.filter(i => i.status === 'idea').length,
		in_progress: ideas.filter(i => i.status === 'in_progress').length,
		completed: ideas.filter(i => i.status === 'completed').length,
		on_hold: ideas.filter(i => i.status === 'on_hold').length,
	};

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Ideas y Proyectos</h1>
				<button
					onClick={() => setShowForm(!showForm)}
					className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
				>
					{showForm ? '✕ Cerrar' : '+ Nueva Idea'}
				</button>
			</div>

			{/* Estadísticas */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-gray-50 border-2 border-gray-400 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-gray-900">{statusCounts.idea}</div>
					<div className="text-sm text-gray-700 mt-1 font-semibold">Ideas</div>
				</div>
				<div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-blue-900">{statusCounts.in_progress}</div>
					<div className="text-sm text-blue-800 mt-1 font-semibold">En Progreso</div>
				</div>
				<div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-green-900">{statusCounts.completed}</div>
					<div className="text-sm text-green-800 mt-1 font-semibold">Completados</div>
				</div>
				<div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 text-center">
					<div className="text-3xl font-bold text-yellow-900">{statusCounts.on_hold}</div>
					<div className="text-sm text-yellow-800 mt-1 font-semibold">En Pausa</div>
				</div>
			</div>

			{/* Formulario */}
			{showForm && (
				<div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300">
					<h2 className="text-2xl font-bold mb-4 text-gray-900">
						{editingIdea ? 'Editar Idea' : 'Nueva Idea'}
					</h2>
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-bold mb-1 text-gray-900">Título</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Ej: Aplicación de gestión de tareas"
								className="w-full border-2 border-gray-400 rounded px-3 py-2 text-gray-900 font-medium"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-bold mb-1 text-gray-900">Descripción</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Describe tu idea o proyecto..."
								className="w-full border-2 border-gray-400 rounded px-3 py-2 h-32 text-gray-900 font-medium"
								required
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-bold mb-1 text-gray-900">Estado</label>
								<select
									value={status}
									onChange={(e) => setStatus(e.target.value as Idea['status'])}
									className="w-full border-2 border-gray-400 rounded px-3 py-2 text-gray-900 font-medium"
								>
									<option value="idea">Idea</option>
									<option value="in_progress">En Progreso</option>
									<option value="completed">Completado</option>
									<option value="on_hold">En Pausa</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-bold mb-1 text-gray-900">Prioridad</label>
								<select
									value={priority}
									onChange={(e) => setPriority(e.target.value as Idea['priority'])}
									className="w-full border-2 border-gray-400 rounded px-3 py-2 text-gray-900 font-medium"
								>
									<option value="low">Baja</option>
									<option value="medium">Media</option>
									<option value="high">Alta</option>
								</select>
							</div>
						</div>
						<div>
							<label className="block text-sm font-bold mb-1 text-gray-900">Tags (separados por coma)</label>
							<input
								type="text"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								placeholder="Ej: web, mobile, ai"
								className="w-full border-2 border-gray-400 rounded px-3 py-2 text-gray-900 font-medium"
							/>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={loading}
								className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800 transition-colors"
							>
								{loading ? 'Guardando...' : editingIdea ? 'Actualizar' : 'Guardar'}
							</button>
							<button
								type="button"
								onClick={cancelEdit}
								className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
							>
								Cancelar
							</button>
						</div>
						{error && <p className="text-red-600 text-sm">{error}</p>}
					</form>
				</div>
			)}

			{/* Filtros */}
			<div className="bg-white rounded-lg shadow p-4">
				<h3 className="font-bold text-lg mb-3 text-gray-900">Filtros y Búsqueda</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div>
						<label className="block text-sm font-bold mb-1 text-gray-900">Buscar</label>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar en título o descripción..."
							className="w-full border-2 border-gray-400 rounded px-3 py-2 text-sm text-gray-900 font-medium"
						/>
					</div>
					<div>
						<label className="block text-sm font-bold mb-1 text-gray-900">Estado</label>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="w-full border-2 border-gray-400 rounded px-3 py-2 text-sm text-gray-900 font-medium"
						>
							<option value="">Todos los estados</option>
							<option value="idea">Idea</option>
							<option value="in_progress">En Progreso</option>
							<option value="completed">Completado</option>
							<option value="on_hold">En Pausa</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-bold mb-1 text-gray-900">Prioridad</label>
						<select
							value={filterPriority}
							onChange={(e) => setFilterPriority(e.target.value)}
							className="w-full border-2 border-gray-400 rounded px-3 py-2 text-sm text-gray-900 font-medium"
						>
							<option value="">Todas las prioridades</option>
							<option value="low">Baja</option>
							<option value="medium">Media</option>
							<option value="high">Alta</option>
						</select>
					</div>
				</div>
			</div>

			{/* Vista de Cartas */}
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-medium">
						Ideas ({filteredIdeas.length})
					</h2>
					<button
						onClick={loadIdeas}
						disabled={loadingHistory}
						className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
					>
						{loadingHistory ? 'Cargando...' : 'Actualizar'}
					</button>
				</div>

				{loadingHistory ? (
					<div className="text-center py-8">
						<div className="text-sm text-gray-500">Cargando ideas...</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredIdeas.map((idea) => (
							<div
								key={idea.id}
								className={`border-2 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all ${statusColors[idea.status]}`}
							>
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-lg font-bold flex-1 mr-2 text-gray-900">{idea.title}</h3>
									<span className={`text-xs px-2 py-1 rounded ${priorityColors[idea.priority]}`}>
										{priorityLabels[idea.priority]}
									</span>
								</div>
								
								<p className="text-gray-800 text-sm mb-3 line-clamp-3 font-medium">{idea.description}</p>
								
								<div className="mb-3">
									<label className="text-xs font-medium text-gray-600 block mb-1">Estado:</label>
									<select
										value={idea.status}
										onChange={(e) => updateStatus(idea, e.target.value as Idea['status'])}
										className={`w-full text-sm border-2 rounded px-2 py-1 ${statusColors[idea.status]}`}
									>
										<option value="idea">Idea</option>
										<option value="in_progress">En Progreso</option>
										<option value="completed">Completado</option>
										<option value="on_hold">En Pausa</option>
									</select>
								</div>

								{idea.tags && idea.tags.length > 0 && (
									<div className="flex flex-wrap gap-1 mb-3">
										{idea.tags.map(tag => (
											<span key={tag} className="px-2 py-1 bg-gray-800 text-white rounded text-xs font-medium">
												#{tag}
											</span>
										))}
									</div>
								)}

								<div className="text-xs text-gray-700 mb-3 font-semibold">
									{new Date(idea.created_at).toLocaleDateString('es-ES')}
								</div>

								<div className="flex gap-2">
									<button
										onClick={() => editIdea(idea)}
										className="flex-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
									>
										✏️ Editar
									</button>
									<button
										onClick={() => deleteIdea(idea.id)}
										className="flex-1 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
									>
										🗑️ Eliminar
									</button>
								</div>
							</div>
						))}
						{filteredIdeas.length === 0 && (
							<div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
								<p className="text-gray-500 mb-2">
									{searchQuery || filterStatus || filterPriority
										? 'No se encontraron ideas con estos filtros'
										: 'Aún no hay ideas guardadas'}
								</p>
								<button
									onClick={() => setShowForm(true)}
									className="text-blue-600 hover:text-blue-800 font-medium"
								>
									+ Agregar tu primera idea
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

