import type { ChartOptions } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

const palette = [
  'rgba(59, 130, 246, 0.85)',
  'rgba(16, 185, 129, 0.85)',
  'rgba(245, 158, 11, 0.85)',
  'rgba(239, 68, 68, 0.85)',
  'rgba(139, 92, 246, 0.85)',
  'rgba(236, 72, 153, 0.85)',
  'rgba(20, 184, 166, 0.85)',
  'rgba(99, 102, 241, 0.85)',
]

function colorsFor(n: number): string[] {
  return Array.from({ length: n }, (_, i) => palette[i % palette.length])
}

export type InternshipStatsChartsProps = {
  labels: string[]
  values: number[]
}

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Applications by status',
    },
  },
}

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Applications by status (count)',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
}

export function InternshipStatsCharts({ labels, values }: InternshipStatsChartsProps) {
  const bg = colorsFor(labels.length)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Applications',
        data: values,
        backgroundColor: bg,
        borderColor: bg.map((c) => c.replace('0.85', '1')),
        borderWidth: 1,
      },
    ],
  }

  if (labels.length === 0 || values.every((v) => v === 0)) {
    return (
      <p style={{ color: '#666', marginTop: '1rem' }}>
        No application data to chart yet. Add internships to see statistics.
      </p>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem',
      }}
    >
      <div style={{ height: 320, position: 'relative' }}>
        <Doughnut data={chartData} options={doughnutOptions} />
      </div>
      <div style={{ height: 320, position: 'relative' }}>
        <Bar data={chartData} options={barOptions} />
      </div>
    </div>
  )
}
