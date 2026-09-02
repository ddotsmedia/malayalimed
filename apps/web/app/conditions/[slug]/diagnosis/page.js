import ConditionSection from '@/components/knowledge/ConditionSection';
export const dynamic = 'force-dynamic';
export default async function Page(props) { const { slug } = await props.params; return <div className="mx-auto max-w-2xl px-4 py-6"><ConditionSection slug={slug} field="diagnosis_tests" label="Diagnosis & Tests" /></div>; }
