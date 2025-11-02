interface KPICardProps {
  title: string;
  value: string;
}

export default function KPICard({ title, value }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
