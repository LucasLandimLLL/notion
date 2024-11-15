'use client';

import { use } from 'react';
import Document from "@/components/ui/Document";

function DocumentPage({ params }) {
    const resolvedParams = use(params);

    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={resolvedParams.id} />
        </div>
    );
}

export default DocumentPage;
