import React from 'react';
import { notFound } from 'next/navigation';
import { mockWeddingData } from '@/lib/mockData';
import MinimalistWedding from '@/components/templates/wedding/MinimalistWedding';
import ElegantWedding from '@/components/templates/wedding/ElegantWedding';
import RusticWedding from '@/components/templates/wedding/RusticWedding';

export default async function PreviewWeddingTemplate({
  params,
}: {
  params: Promise<{ template: string }>
}) {
  const resolvedParams = await params;
  const templateName = resolvedParams.template;

  switch (templateName) {
    case 'minimalist':
      return <MinimalistWedding data={mockWeddingData} />;
    case 'elegant':
      return <ElegantWedding data={mockWeddingData} />;
    case 'rustic':
      return <RusticWedding data={mockWeddingData} />;
    default:
      notFound();
  }
}
