'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PushItem } from '@/types/push';
import type { Prompt } from '@/types/prompt';
import type { Idea } from '@/types/idea';

export default function Home() {
	const [pushes, setPushes] = useState<PushItem[]>([]);
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			try {
				const [pushesRes, promptsRes, ideasRes] = await Promise.all([
					fetch('/api/pushes', { cache: 'no-store' }),
					fetch('/api/prompts', { cache: 'no-store' }),
					fetch('/api/ideas', { cache: 'no-store' }),
				]);

				const [pushesData, promptsData, ideasData] = await Promise.all([
					pushesRes.json(),
					promptsRes.json(),
					ideasRes.json(),
				]);

				setPushes(pushesData.pushes || []);
				setPrompts(promptsData.prompts || []);
				setIdeas(ideasData.ideas || []);
			} catch (err) {
				console.error('Error loading dashboard data:', err);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, []);

	const recentPushes = pushes.slice(0, 5);
	const favoritePrompts = prompts.filter(p => p.is_favorite).slice(0, 5);
	const activeIdeas = ideas.filter(i => i.status === 'in_progress').slice(0, 5);

	const ideaStatusCounts = {
		idea: ideas.filter(i => i.status === 'idea').length,
		in_progress: ideas.filter(i => i.status === 'in_progress').length,
		completed: ideas.filter(i => i.status === 'completed').length,
		on_hold: ideas.filter(i => i.status === 'on_hold').length,
	};

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8">
			<div className="text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6">
				<h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
				<p className="text-gray-300">Resumen de tu actividad y proyectos</p>
			</div>

			{loading ? (
				<div className="text-center py-12">
					<div className="text-gray-500">Cargando datos...</div>
				</div>
			) : (
				<>
					{/* Estadísticas Principales */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Link href="/pushes" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
							<div className="text-4xl font-bold mb-2">{pushes.length}</div>
							<div className="text-blue-100 font-medium">Total Pushes</div>
							<div className="text-sm text-blue-200 mt-1">
								{pushes.length > 0 && `Último: ${new Date(pushes[0].created_at).toLocaleDateString('es-ES')}`}
							</div>
						</Link>

						<Link href="/prompts" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
							<div className="text-4xl font-bold mb-2">{prompts.length}</div>
							<div className="text-purple-100 font-medium">Total Prompts</div>
							<div className="text-sm text-purple-200 mt-1">
								⭐ {prompts.filter(p => p.is_favorite).length} favoritos
							</div>
						</Link>

						<Link href="/ideas" className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
							<div className="text-4xl font-bold mb-2">{ideas.length}</div>
							<div className="text-green-100 font-medium">Total Ideas</div>
							<div className="text-sm text-green-200 mt-1">
								🚀 {ideaStatusCounts.in_progress} en progreso
							</div>
						</Link>

						<div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
							<div className="text-4xl font-bold mb-2">{ideaStatusCounts.completed}</div>
							<div className="text-yellow-100 font-medium">Completados</div>
							<div className="text-sm text-yellow-200 mt-1">
								✨ Proyectos terminados
							</div>
						</div>
					</div>

					{/* Grid de 3 columnas */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Pushes Recientes */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold text-gray-800">Pushes Recientes</h2>
								<Link href="/pushes" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
									Ver todos →
								</Link>
							</div>
							{recentPushes.length > 0 ? (
								<ul className="space-y-3">
									{recentPushes.map((push) => (
										<li key={push.id} className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded-r">
											<div className="text-xs text-gray-500 mb-1">
												{new Date(push.created_at).toLocaleDateString('es-ES')}
											</div>
											<p className="text-sm text-gray-900 line-clamp-2 font-medium">{push.comment}</p>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-sm text-center py-8">No hay pushes todavía</p>
							)}
						</div>

						{/* Prompts Favoritos */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold text-gray-800">Prompts Favoritos</h2>
								<Link href="/prompts" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
									Ver todos →
								</Link>
							</div>
							{favoritePrompts.length > 0 ? (
								<ul className="space-y-3">
									{favoritePrompts.map((prompt) => (
										<li key={prompt.id} className="border-l-4 border-purple-400 pl-3 py-2 bg-purple-50 rounded-r">
											<div className="font-medium text-sm text-gray-800 mb-1">
												⭐ {prompt.title}
											</div>
											<p className="text-xs text-gray-700 line-clamp-2 font-medium">{prompt.content}</p>
											{prompt.category && (
												<span className="inline-block mt-1 text-xs px-2 py-0.5 bg-purple-200 text-purple-900 rounded font-semibold">
													{prompt.category}
												</span>
											)}
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-sm text-center py-8">No hay prompts favoritos</p>
							)}
						</div>

						{/* Ideas Activas */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold text-gray-800">Ideas en Progreso</h2>
								<Link href="/ideas" className="text-sm text-green-600 hover:text-green-800 font-medium">
									Ver todas →
								</Link>
							</div>
							{activeIdeas.length > 0 ? (
								<ul className="space-y-3">
									{activeIdeas.map((idea) => (
										<li key={idea.id} className="border-l-4 border-green-400 pl-3 py-2 bg-green-50 rounded-r">
											<div className="font-medium text-sm text-gray-800 mb-1">
												{idea.title}
											</div>
											<p className="text-xs text-gray-700 line-clamp-2 font-medium">{idea.description}</p>
											<span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded font-semibold ${
												idea.priority === 'high' ? 'bg-red-200 text-red-900' :
												idea.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
												'bg-green-200 text-green-900'
											}`}>
												Prioridad: {idea.priority === 'high' ? 'Alta' : idea.priority === 'medium' ? 'Media' : 'Baja'}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-sm text-center py-8">No hay ideas en progreso</p>
							)}
						</div>
					</div>

					{/* Estado de Ideas */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Estado de Ideas y Proyectos</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-400">
								<div className="text-3xl font-bold text-gray-900">{ideaStatusCounts.idea}</div>
								<div className="text-sm text-gray-700 mt-1 font-semibold">Ideas</div>
							</div>
							<div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-400">
								<div className="text-3xl font-bold text-blue-900">{ideaStatusCounts.in_progress}</div>
								<div className="text-sm text-blue-800 mt-1 font-semibold">En Progreso</div>
							</div>
							<div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-400">
								<div className="text-3xl font-bold text-green-900">{ideaStatusCounts.completed}</div>
								<div className="text-sm text-green-800 mt-1 font-semibold">Completados</div>
							</div>
							<div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-400">
								<div className="text-3xl font-bold text-yellow-900">{ideaStatusCounts.on_hold}</div>
								<div className="text-sm text-yellow-800 mt-1 font-semibold">En Pausa</div>
							</div>
						</div>
					</div>

					{/* Enlaces Rápidos */}
					<div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-bold mb-4 text-white">Acciones Rápidas</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							<Link href="/pushes" className="bg-white hover:bg-gray-100 rounded-lg p-4 text-center transition-all">
								<div className="text-2xl mb-2">🚀</div>
								<div className="text-sm font-bold text-gray-900">Nuevo Push</div>
							</Link>
							<Link href="/prompts" className="bg-white hover:bg-gray-100 rounded-lg p-4 text-center transition-all">
								<div className="text-2xl mb-2">💡</div>
								<div className="text-sm font-bold text-gray-900">Nuevo Prompt</div>
							</Link>
							<Link href="/ideas" className="bg-white hover:bg-gray-100 rounded-lg p-4 text-center transition-all">
								<div className="text-2xl mb-2">✨</div>
								<div className="text-sm font-bold text-gray-900">Nueva Idea</div>
							</Link>
							<Link href="/ideas" className="bg-white hover:bg-gray-100 rounded-lg p-4 text-center transition-all">
								<div className="text-2xl mb-2">📊</div>
								<div className="text-sm font-bold text-gray-900">Ver Proyectos</div>
							</Link>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
