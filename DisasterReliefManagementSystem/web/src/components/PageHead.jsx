// One heading block used at the top of every section view.
export default function PageHead({ title, sub }) {
  return (
    <div className="pt-10 pb-6">
      <h1 className="text-[26px] font-bold tracking-[-0.015em]">{title}</h1>
      <p className="mt-0.5 text-[14.5px] text-muted">{sub}</p>
    </div>
  );
}
