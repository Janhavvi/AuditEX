import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AuditReport } from '../types/audit';
import { currency } from '../utils/formatter';

const colors = ['#3B82F6', '#8B5CF6', '#22D3EE'];

export default function SavingsChart({ report }: { report: AuditReport }) {
  const toolData = report.tools.map((tool, index) => ({
    name: tool.toolName,
    spend: tool.monthlySpend,
    fill: colors[index % colors.length],
  }));
  const savingsData = [
    { month: 'Now', spend: report.totals.totalMonthlySpend },
    { month: '30d', spend: report.totals.totalMonthlySpend - report.totals.estimatedMonthlySavings * 0.35 },
    { month: '60d', spend: report.totals.totalMonthlySpend - report.totals.estimatedMonthlySavings * 0.72 },
    { month: '90d', spend: report.totals.totalMonthlySpend - report.totals.estimatedMonthlySavings },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-white">Tool-wise breakdown</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={toolData} innerRadius={62} outerRadius={98} paddingAngle={5} dataKey="spend">
                {toolData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => currency(Number(value))} contentStyle={{ background: '#0A0F23', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#FFFFFF' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-white">Monthly spend by tool</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toolData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => currency(Number(value))} contentStyle={{ background: '#0A0F23', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#FFFFFF' }} />
                <Bar dataKey="spend" radius={[8, 8, 0, 0]}>
                  {toolData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-white">Savings realization curve</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => currency(Number(value))} contentStyle={{ background: '#0A0F23', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#FFFFFF' }} />
                <Line type="monotone" dataKey="spend" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
