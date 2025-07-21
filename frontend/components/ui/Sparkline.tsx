// frontend/components/ui/Sparkline.tsx
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: { value: number }[];
  color: string;
}

const Sparkline = ({ data, color }: SparklineProps) => {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;
