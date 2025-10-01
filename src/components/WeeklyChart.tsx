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
		<div className="bg-white border rounded-lg p-4">
			<h3 className="text-lg font-semibold mb-4">Commits por Día de la Semana</h3>
			<ResponsiveContainer width="100%" height={250}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="day" />
					<YAxis allowDecimals={false} />
					<Tooltip />
					<Bar dataKey="commits" fill="#3b82f6" radius={[8, 8, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

