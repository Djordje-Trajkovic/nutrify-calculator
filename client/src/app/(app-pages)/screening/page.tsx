import Link from 'next/link';

export default function ScreeningPage() {
    const screeningOptions = [
        {
            title: 'NRS 2002',
            description: 'Nutritional Risk Screening 2002',
            href: '/screening/NRS_2002',
        },
        {
            title: 'MUST',
            description: 'Malnutrition Universal Screening Tool',
            href: '/screening/MUST',
        },
        {
            title: 'MST',
            description: 'Malnutrition Screening Tool',
            href: '/screening/MST',
        },
        {
            title: 'PG_SGA',
            description: 'Patient-Generated Subjective Global Assessment',
            href: '/screening/PG_SGA',
        },
        {
            title: 'MNA-LF',
            description: 'Mini Nutritional Assessment - Long Form',
            href: '/screening/MNA-LF',
        },
        {
            title: 'MNA-SF',
            description: 'Mini Nutritional Assessment - Short Form',
            href: '/screening/MNA-SF',
        },
        {
            title: 'SARC-F',
            description: 'Sarcopenia Screening Tool',
            href: '/screening/SARC-F',
        },
        {
            title: 'GLIM',
            description: 'Global Leadership Initiative on Malnutrition',
            href: '/screening/GLIM',
        },
        {
            title: 'SNAQ_65+',
            description: 'Short Nutritional Assessment Questionnaire for 65+',
            href: '/screening/SNAQ_65+',
        },
       
    ];

    return (
        <div className="container mx-auto px-4 py-8 text-DarkGreen">
            <h1 className="text-3xl font-bold mb-6">Select Screening Tool</h1>
            <p className="text-DarkGreen mb-8">
                Choose a nutritional screening assessment tool to begin
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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