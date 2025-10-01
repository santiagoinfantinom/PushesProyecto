import type { PushItem } from '@/types/push';

/**
 * Calculate commits per day of week
 * Returns array with count for each day (0 = Sunday, 6 = Saturday)
 */
export function getCommitsPerWeekDay(pushes: PushItem[]) {
	const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
	const counts = new Array(7).fill(0);

	pushes.forEach(push => {
		const date = new Date(push.created_at);
		const dayOfWeek = date.getDay();
		counts[dayOfWeek]++;
	});

	return days.map((day, index) => ({
		day,
		commits: counts[index]
	}));
}

/**
 * Calculate current streak of consecutive days with commits
 */
export function getCurrentStreak(pushes: PushItem[]): number {
	if (pushes.length === 0) return 0;

	// Sort pushes by date (newest first)
	const sortedPushes = [...pushes].sort((a, b) => 
		new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	// Get unique dates (only the date part, not time)
	const uniqueDates = new Set<string>();
	sortedPushes.forEach(push => {
		const date = new Date(push.created_at);
		const dateString = date.toDateString();
		uniqueDates.add(dateString);
	});

	const sortedDates = Array.from(uniqueDates)
		.map(d => new Date(d))
		.sort((a, b) => b.getTime() - a.getTime());

	// Check if there's a commit today or yesterday
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	
	const mostRecentCommit = sortedDates[0];
	mostRecentCommit.setHours(0, 0, 0, 0);
	
	const daysDiff = Math.floor((today.getTime() - mostRecentCommit.getTime()) / (1000 * 60 * 60 * 24));
	
	// If last commit was more than 1 day ago, streak is broken
	if (daysDiff > 1) return 0;

	// Count consecutive days
	let streak = 1;
	for (let i = 1; i < sortedDates.length; i++) {
		const currentDate = new Date(sortedDates[i]);
		const previousDate = new Date(sortedDates[i - 1]);
		
		currentDate.setHours(0, 0, 0, 0);
		previousDate.setHours(0, 0, 0, 0);
		
		const diff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
		
		if (diff === 1) {
			streak++;
		} else {
			break;
		}
	}

	return streak;
}

/**
 * Get total commits count
 */
export function getTotalCommits(pushes: PushItem[]): number {
	return pushes.length;
}

/**
 * Get commits this week
 */
export function getCommitsThisWeek(pushes: PushItem[]): number {
	const now = new Date();
	const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	
	return pushes.filter(push => {
		const pushDate = new Date(push.created_at);
		return pushDate >= weekAgo;
	}).length;
}

