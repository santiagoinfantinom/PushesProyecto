'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
	const pathname = usePathname();
	
	const links = [
		{ href: '/', label: 'Dashboard' },
		{ href: '/pushes', label: 'Seguimiento de Pushes' },
		{ href: '/prompts', label: 'Prompt Manager' },
		{ href: '/ideas', label: 'Ideas/Proyectos' },
	];
	
	return (
		<nav className="bg-white border-b">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center space-x-8">
						<h1 className="text-xl font-bold text-gray-900">ReportingApp</h1>
						<div className="flex space-x-4">
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										pathname === link.href
											? 'bg-gray-900 text-white'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}


