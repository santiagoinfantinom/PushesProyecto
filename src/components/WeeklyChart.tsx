'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PushItem } from '@/types/push';
import { getCommitsPerWeekDay } from '@/lib/analytics';

interface WeeklyChartProps {
	pushes: PushItem[];
}

export default function WeeklyChart({ pushes }: WeeklyChartProps) {
	const data = getCommitsPerWeekDay(pushes);

	return (
		<div className="bg-white border-2 border-gray-300 rounded-lg p-4">
			<h3 className="text-lg font-bold mb-4 text-gray-900">Commits por Día de la Semana</h3>
			<ResponsiveContainer width="100%" height={250}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis 
						dataKey="day" 
						tick={{ fill: '#111827', fontWeight: 'bold' }}
						style={{ fontSize: '12px' }}
					/>
					<YAxis 
						allowDecimals={false}
						tick={{ fill: '#111827', fontWeight: 'bold' }}
						style={{ fontSize: '12px' }}
					/>
					<Tooltip 
						contentStyle={{ 
							backgroundColor: 'white', 
							border: '2px solid #9ca3af',
							borderRadius: '8px',
							fontWeight: 'bold'
						}}
					/>
					<Bar dataKey="commits" fill="#3b82f6" radius={[8, 8, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

