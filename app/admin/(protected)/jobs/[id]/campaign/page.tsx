import React from 'react';

export default async function CampaignPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kampány beállítása</h1>
      <p>Kampány a következő álláshoz: {params.id}</p>
    </div>
  );
}
