'use client';

import type { PushItem } from '@/types/push';
import { getCurrentStreak, getTotalCommits, getCommitsThisWeek } from '@/lib/analytics';

interface StatsCardsProps {
	pushes: PushItem[];
}

export default function StatsCards({ pushes }: StatsCardsProps) {
	const streak = getCurrentStreak(pushes);
	const total = getTotalCommits(pushes);
	const thisWeek = getCommitsThisWeek(pushes);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			{/* Racha Actual */}
			<div className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm opacity-90">Racha Actual</p>
						<p className="text-4xl font-bold mt-2">{streak}</p>
						<p className="text-sm opacity-90 mt-1">
							{streak === 1 ? 'día' : 'días'} consecutivos
						</p>
					</div>
					<div className="text-5xl opacity-20">🔥</div>
				</div>
			</div>

			{/* Total de Commits */}
			<div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg p-6 shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm opacity-90">Total de Commits</p>
						<p className="text-4xl font-bold mt-2">{total}</p>
						<p className="text-sm opacity-90 mt-1">en el historial</p>
					</div>
					<div className="text-5xl opacity-20">📊</div>
				</div>
			</div>

			{/* Commits Esta Semana */}
			<div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg p-6 shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm opacity-90">Esta Semana</p>
						<p className="text-4xl font-bold mt-2">{thisWeek}</p>
						<p className="text-sm opacity-90 mt-1">últimos 7 días</p>
					</div>
					<div className="text-5xl opacity-20">📅</div>
				</div>
			</div>
		</div>
	);
}

