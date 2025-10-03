'use client';

import { useEffect, useState } from 'react';
import type { PushItem } from '@/types/push';
import StatsCards from '@/components/StatsCards';
import WeeklyChart from '@/components/WeeklyChart';

export default function PushesPage() {
	const [githubLink, setGithubLink] = useState('');
	const [comment, setComment] = useState('');
	const [loading, setLoading] = useState(false);
	const [pushes, setPushes] = useState<PushItem[]>([]);
	const [filteredPushes, setFilteredPushes] = useState<PushItem[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loadingHistory, setLoadingHistory] = useState(true);
	const [searchDate, setSearchDate] = useState('');

	async function loadPushes() {
		setLoadingHistory(true);
		setError(null);
		try {
			const res = await fetch('/api/pushes', { 
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}
			
			const data = await res.json();
			console.log('Loaded pushes:', data); // Debug log
			
			if (data.pushes) {
				setPushes(data.pushes);
				setFilteredPushes(data.pushes);
			} else {
				setPushes([]);
				setFilteredPushes([]);
			}
		} catch (err) {
			console.error('Error loading pushes:', err);
			setError(`Error cargando historial: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoadingHistory(false);
		}
	}

	useEffect(() => {
		loadPushes();
	}, []);

	// Filter pushes by date
	useEffect(() => {
		if (!searchDate) {
			setFilteredPushes(pushes);
			return;
		}
		
		const searchDateObj = new Date(searchDate);
		const filtered = pushes.filter(push => {
			const pushDate = new Date(push.created_at);
			return pushDate.toDateString() === searchDateObj.toDateString();
		});
		setFilteredPushes(filtered);
	}, [searchDate, pushes]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		
		try {
			const res = await fetch('/api/pushes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ github_link: githubLink, comment })
			});
			
			const data = await res.json();
			console.log('Save response:', data); // Debug log
			
			if (!res.ok) {
				throw new Error(typeof data.error === 'string' ? data.error : `HTTP ${res.status}`);
			}
			
			// Clear form
			setGithubLink('');
			setComment('');
			
			// Reload history
			await loadPushes();
			
		} catch (err) {
			console.error('Error saving push:', err);
			setError(`Error guardando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		} finally {
			setLoading(false);
		}
	}

	async function deletePush(id: string) {
		if (!confirm('¿Estás seguro de que quieres eliminar este push?')) {
			return;
		}

		try {
			const res = await fetch(`/api/pushes?id=${id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Error eliminando');
			}

			// Reload history
			await loadPushes();
		} catch (err) {
			console.error('Error deleting push:', err);
			setError(`Error eliminando: ${err instanceof Error ? err.message : 'Error desconocido'}`);
		}
	}

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-center mb-8">Seguimiento de Pushes</h1>
			
			{/* Dashboard de Estadísticas */}
			<StatsCards pushes={pushes} />
			
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Formulario */}
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold">Agregar Push</h2>
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium">Link de GitHub</label>
							<input
								type="url"
								value={githubLink}
								onChange={(e) => setGithubLink(e.target.value)}
								placeholder="https://github.com/usuario/repo/commit/sha"
								className="mt-1 w-full border rounded px-3 py-2"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium">Comentario</label>
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Qué cambiaste en este push"
								className="mt-1 w-full border rounded px-3 py-2 h-24"
								required
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800 transition-colors"
						>
							{loading ? 'Guardando...' : 'Guardar'}
						</button>
						{error && <p className="text-red-600 text-sm">{error}</p>}
					</form>
				</div>
				
				{/* Gráfico Semanal */}
				<div>
					<WeeklyChart pushes={pushes} />
				</div>
			</div>

			{/* Historial */}
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-medium">Historial</h2>
					<button 
						onClick={loadPushes}
						disabled={loadingHistory}
						className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
					>
						{loadingHistory ? 'Cargando...' : 'Actualizar'}
					</button>
				</div>
				
				{/* Date Search Bar */}
				<div className="flex gap-2 items-center">
					<label className="text-sm font-medium">Buscar por fecha:</label>
					<input
						type="date"
						value={searchDate}
						onChange={(e) => setSearchDate(e.target.value)}
						className="border rounded px-3 py-1 text-sm"
					/>
					{searchDate && (
						<button
							onClick={() => setSearchDate('')}
							className="text-sm text-gray-500 hover:text-gray-700"
						>
							Limpiar
						</button>
					)}
				</div>

				{loadingHistory ? (
					<div className="text-center py-4">
						<div className="text-sm text-gray-500">Cargando historial...</div>
					</div>
				) : (
					<ul className="space-y-3">
						{filteredPushes.map((p) => (
							<li key={p.id} className="border-2 border-gray-300 rounded p-3 bg-white shadow-sm relative hover:shadow-md transition-shadow">
								<div className="flex justify-between items-start mb-2">
									<div className="text-sm text-gray-700 font-semibold">
										{new Date(p.created_at).toLocaleString('es-ES')}
									</div>
									<button
										onClick={() => deletePush(p.id)}
										className="text-red-700 hover:text-red-900 text-sm font-bold px-2 py-1 rounded hover:bg-red-50"
										title="Eliminar"
									>
										🗑️ Eliminar
									</button>
								</div>
								<a 
									className="text-blue-700 underline break-all hover:text-blue-900 font-semibold" 
									href={p.github_link} 
									target="_blank" 
									rel="noreferrer"
								>
									{p.github_link}
								</a>
								<p className="mt-2 text-gray-900 font-medium">{p.comment}</p>
							</li>
						))}
						{filteredPushes.length === 0 && (
							<li className="text-sm text-gray-500 text-center py-4">
								{searchDate ? 'No hay pushes en esta fecha' : 'Aún no hay pushes'}
							</li>
						)}
					</ul>
				)}
				
				{error && (
					<div className="bg-red-50 border border-red-200 rounded p-3">
						<p className="text-red-600 text-sm">{error}</p>
					</div>
				)}
			</div>
		</div>
	);
}

