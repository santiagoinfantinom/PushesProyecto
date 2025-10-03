'use client';

import { useEffect, useState } from 'react';
import type { Prompt } from '@/types/prompt';

export default function PromptsPage() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('');
	const [isFavorite, setIsFavorite] = useState(false);
	const [tags, setTags] = useState('');
	const [loading, setLoading] = useState(false);
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loadingHistory, setLoadingHistory] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterCategory, setFilterCategory] = useState('');
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
	const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

	async function loadPrompts() {
		setLoadingHistory(true);
		setError(null);
		try {
			const res = await fetch('/api/prompts', {
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}

			const data = await res.json();

			if (data.prompts) {
				setPrompts(data.prompts);
				setFilteredPrompts(data.prompts);
			} else {
				setPrompts([]);
				setFilteredPrompts([]);
			}
		} catch (err) {
			console.error('Error loading prompts:', err);
			setError(`Error cargando prompts: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoadingHistory(false);
		}
	}

	useEffect(() => {
		loadPrompts();
	}, []);

	// Filter prompts
	useEffect(() => {
		let filtered = prompts;

		if (searchQuery) {
			filtered = filtered.filter(prompt =>
				prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (filterCategory) {
			filtered = filtered.filter(prompt => prompt.category === filterCategory);
		}

		if (showFavoritesOnly) {
			filtered = filtered.filter(prompt => prompt.is_favorite);
		}

		setFilteredPrompts(filtered);
	}, [searchQuery, filterCategory, showFavoritesOnly, prompts]);

	// Get unique categories
	const categories = Array.from(new Set(prompts.map(p => p.category).filter(Boolean)));

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const tagsArray = tags.trim() ? tags.split(',').map(t => t.trim()) : [];

			const method = editingPrompt ? 'PUT' : 'POST';
			const body = editingPrompt
				? { id: editingPrompt.id, title, content, category: category || null, is_favorite: isFavorite, tags: tagsArray.length > 0 ? tagsArray : null }
				: { title, content, category: category || null, is_favorite: isFavorite, tags: tagsArray.length > 0 ? tagsArray : null };

			const res = await fetch('/api/prompts', {
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
			setContent('');
			setCategory('');
			setIsFavorite(false);
			setTags('');
			setEditingPrompt(null);

			// Reload history
			await loadPrompts();

		} catch (err) {
			console.error('Error saving prompt:', err);
			setError(`Error guardando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoading(false);
		}
	}

	async function deletePrompt(id: string) {
		if (!confirm('¿Estás seguro de que quieres eliminar este prompt?')) {
			return;
		}

		try {
			const res = await fetch(`/api/prompts?id=${id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error eliminando');
			}

			await loadPrompts();
		} catch (err) {
			console.error('Error deleting prompt:', err);
			setError(`Error eliminando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		}
	}

	async function toggleFavorite(prompt: Prompt) {
		try {
			const res = await fetch('/api/prompts', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: prompt.id, is_favorite: !prompt.is_favorite })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error actualizando');
			}

			await loadPrompts();
		} catch (err) {
			console.error('Error toggling favorite:', err);
			setError(`Error actualizando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		}
	}

	function editPrompt(prompt: Prompt) {
		setEditingPrompt(prompt);
		setTitle(prompt.title);
		setContent(prompt.content);
		setCategory(prompt.category || '');
		setIsFavorite(prompt.is_favorite);
		setTags(prompt.tags?.join(', ') || '');
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancelEdit() {
		setEditingPrompt(null);
		setTitle('');
		setContent('');
		setCategory('');
		setIsFavorite(false);
		setTags('');
	}

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-center mb-8">Prompt Manager</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Formulario */}
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold">
						{editingPrompt ? 'Editar Prompt' : 'Agregar Prompt'}
					</h2>
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Título</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Ej: Análisis de código"
								className="w-full border rounded px-3 py-2"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Contenido del Prompt</label>
							<textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Escribe el prompt aquí..."
								className="w-full border rounded px-3 py-2 h-32"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Categoría</label>
							<input
								type="text"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder="Ej: Desarrollo, Testing, Documentación"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
							<input
								type="text"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								placeholder="Ej: react, typescript, api"
								className="w-full border rounded px-3 py-2"
							/>
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="favorite"
								checked={isFavorite}
								onChange={(e) => setIsFavorite(e.target.checked)}
								className="w-4 h-4 mr-2"
							/>
							<label htmlFor="favorite" className="text-sm font-medium">
								Marcar como favorito
							</label>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={loading}
								className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800 transition-colors"
							>
								{loading ? 'Guardando...' : editingPrompt ? 'Actualizar' : 'Guardar'}
							</button>
							{editingPrompt && (
								<button
									type="button"
									onClick={cancelEdit}
									className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
								>
									Cancelar
								</button>
							)}
						</div>
						{error && <p className="text-red-600 text-sm">{error}</p>}
					</form>
				</div>

				{/* Estadísticas y Filtros */}
				<div className="space-y-4">
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-semibold mb-4 text-gray-900">Estadísticas</h3>
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center">
								<div className="text-3xl font-bold text-blue-700">{prompts.length}</div>
								<div className="text-sm text-gray-700 font-semibold">Total Prompts</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-yellow-700">
									{prompts.filter(p => p.is_favorite).length}
								</div>
								<div className="text-sm text-gray-700 font-semibold">Favoritos</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-green-700">{categories.length}</div>
								<div className="text-sm text-gray-700 font-semibold">Categorías</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-purple-700">
									{prompts.reduce((acc, p) => acc + (p.tags?.length || 0), 0)}
								</div>
								<div className="text-sm text-gray-700 font-semibold">Tags Totales</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Filtros y Búsqueda */}
			<div className="bg-white rounded-lg shadow p-4 space-y-3">
				<h3 className="font-bold text-lg text-gray-900">Filtros y Búsqueda</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div>
						<label className="block text-sm font-bold mb-1 text-gray-900">Buscar</label>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar en título o contenido..."
							className="w-full border-2 border-gray-400 rounded px-3 py-2 text-sm text-gray-900 font-medium"
						/>
					</div>
					<div>
						<label className="block text-sm font-bold mb-1 text-gray-900">Categoría</label>
						<select
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}
							className="w-full border-2 border-gray-400 rounded px-3 py-2 text-sm text-gray-900 font-medium"
						>
							<option value="">Todas las categorías</option>
							{categories.map(cat => (
								<option key={cat} value={cat}>{cat}</option>
							))}
						</select>
					</div>
					<div className="flex items-end">
						<label className="flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={showFavoritesOnly}
								onChange={(e) => setShowFavoritesOnly(e.target.checked)}
								className="w-4 h-4 mr-2"
							/>
							<span className="text-sm font-bold text-gray-900">Solo favoritos ⭐</span>
						</label>
					</div>
				</div>
			</div>

			{/* Historial de Prompts */}
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-medium">
						Prompts Guardados ({filteredPrompts.length})
					</h2>
					<button
						onClick={loadPrompts}
						disabled={loadingHistory}
						className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
					>
						{loadingHistory ? 'Cargando...' : 'Actualizar'}
					</button>
				</div>

				{loadingHistory ? (
					<div className="text-center py-4">
						<div className="text-sm text-gray-500">Cargando prompts...</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{filteredPrompts.map((p) => (
							<div key={p.id} className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
								<div className="flex justify-between items-start mb-2">
									<div className="flex items-center gap-2">
										<h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
										<button
											onClick={() => toggleFavorite(p)}
											className="text-xl"
											title={p.is_favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
										>
											{p.is_favorite ? '⭐' : '☆'}
										</button>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => editPrompt(p)}
											className="text-blue-700 hover:text-blue-900 text-sm font-bold px-2 py-1 rounded hover:bg-blue-50"
										>
											✏️ Editar
										</button>
										<button
											onClick={() => deletePrompt(p.id)}
											className="text-red-700 hover:text-red-900 text-sm font-bold px-2 py-1 rounded hover:bg-red-50"
										>
											🗑️ Eliminar
										</button>
									</div>
								</div>
								<div className="mb-2">
									<div className="text-sm text-gray-700 mb-1 font-medium">
										{new Date(p.created_at).toLocaleString('es-ES')}
										{p.category && (
											<span className="ml-2 px-2 py-1 bg-blue-200 text-blue-900 rounded text-xs font-semibold">
												{p.category}
											</span>
										)}
									</div>
								</div>
								<p className="text-gray-900 whitespace-pre-wrap mb-2 font-medium">{p.content}</p>
								{p.tags && p.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{p.tags.map(tag => (
											<span key={tag} className="px-2 py-1 bg-gray-800 text-white rounded text-xs font-medium">
												#{tag}
											</span>
										))}
									</div>
								)}
							</div>
						))}
						{filteredPrompts.length === 0 && (
							<div className="text-sm text-gray-500 text-center py-8 bg-white rounded-lg">
								{searchQuery || filterCategory || showFavoritesOnly
									? 'No se encontraron prompts con estos filtros'
									: 'Aún no hay prompts guardados'}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

