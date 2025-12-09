import Link from 'next/link';

export default function ScreeningPage() {
    const screeningOptions = [
        {
            title: 'NRS 2002',
            description: 'Nutritional Risk Screening 2002',
            href: '/screening/NRS_2002',
        },
        {
            title: 'MNA-SF',
            description: 'Mini Nutritional Assessment Short Form',
            href: '/screening/MNA-SF',
        },
        {
            title: 'MUST',
            description: 'Malnutrition Universal Screening Tool',
            href: '/screening/must',
        },
        {
            title: 'MST',
            description: 'Malnutrition Screening Tool',
            href: '/screening/mst',
        },
        {
            title: 'SGA',
            description: 'Subjective Global Assessment',
            href: '/screening/sga',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8 text-DarkGreen">
            <h1 className="text-3xl font-bold mb-6">Select Screening Tool</h1>
            <p className="text-DarkGreen mb-8">
                Choose a nutritional screening assessment tool to begin
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {screeningOptions.map((option) => (
                    <Link
                        key={option.href}
                        href={option.href}
                        className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
                    >
                        <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
                        <p className="text-DarkGreen">{option.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}