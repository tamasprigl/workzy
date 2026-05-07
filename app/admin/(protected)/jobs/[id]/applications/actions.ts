'use server';

export async function updateApplicationStatus(recordId: string, status: string) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_APPLICATIONS_TABLE_NAME;

  if (!token || !baseId || !tableName) {
    throw new Error('Airtable configuration missing');
  }

  const Airtable = (await import('airtable')).default;
  const base = new Airtable({ apiKey: token }).base(baseId);

  await base(tableName).update([
    {
      id: recordId,
      fields: {
        'Status': status
      }
    }
  ]);
}