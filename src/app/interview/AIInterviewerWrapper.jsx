'use client';
import dynamic from 'next/dynamic';

const AIInterviewer = dynamic(
    () => import('./AIInterviewer'),
    {
        ssr: false,
        loading: () => <p>Loading interview session...</p>
    }
);

export default function AIInterviewerWrapper() {
    return <AIInterviewer />;
}