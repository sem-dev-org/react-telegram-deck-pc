import { useEffect, useRef } from 'react';

type GameChartProps = {
  width: string;
  height: string;
};

export default function GameChart({ width, height }: GameChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Sample data
    const labels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const data = [5500, 2500, 10000, 6000, 14000, 1500, 7000, 20000];

    // Canvas setup
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Gradient setup
    // const gradientStroke = ctx.createLinearGradient(rect.width, 0, 0, 0);
    // gradientStroke.addColorStop(0, '#A6ADBB');
    // gradientStroke.addColorStop(1, '#ff3b74');

    const gradientBkgrd = ctx.createLinearGradient(0, 0, 0, rect.height);
    gradientBkgrd.addColorStop(0, 'rgba(164, 173, 188, 0.2)');
    gradientBkgrd.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Draw chart
    const padding = 0;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Find max value for scaling
    const maxValue = Math.max(...data);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    // Draw horizontal grid lines
    // const yStep = chartHeight / 5;
    // for (let i = 0; i <= 5; i++) {
    //   const y = padding + yStep * i;
    //   ctx.moveTo(padding, y);
    //   ctx.lineTo(padding + chartWidth, y);

    //   // Draw y-axis labels
    //   if (i < 5) {
    //     const value = maxValue - (maxValue / 5) * i;
    //     ctx.fillStyle = '#999';
    //     ctx.font = '12px Arial';
    //     ctx.textAlign = 'right';
    //     ctx.fillText(`${Math.round(value / 1000)}K`, padding - 10, y + 5);
    //   }
    // }
    ctx.stroke();

    // Draw line chart
    ctx.beginPath();
    const xStep = chartWidth / (labels.length - 1);

    // Plot points and connect with curved lines
    data.forEach((value, index) => {
      const x = padding + xStep * index;
      const y = padding + chartHeight - (value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use bezier curves instead of straight lines
        const prevX = padding + xStep * (index - 1);
        const prevY = padding + chartHeight - (data[index - 1] / maxValue) * chartHeight;

        // Control points for the bezier curve
        const cp1x = prevX + (x - prevX) * 0.6;
        const cp1y = prevY;
        const cp2x = x - (x - prevX) * 0.6;
        const cp2y = y;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      }

      // Draw x-axis labels
      //   ctx.fillStyle = '#999';
      //   ctx.font = '12px Arial';
      //   ctx.textAlign = 'center';
      //   ctx.fillText(labels[index], x, padding + chartHeight + 20);
    });

    // Style and stroke the line
    ctx.strokeStyle = '#A6ADBB';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.stroke();

    // Fill area under the line
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradientBkgrd;
    ctx.fill();

    // Add points
    // data.forEach((value, index) => {
    //   const x = padding + xStep * index;
    //   const y = padding + chartHeight - (value / maxValue) * chartHeight;

    //   // Draw point highlight on hover (would need event listeners for real interaction)
    //   ctx.beginPath();
    //   ctx.arc(x, y, 4, 0, Math.PI * 2);
    //   ctx.fillStyle = gradientStroke;
    //   ctx.fill();
    // });
  }, []);

  return (
    <div style={{ width: width, height: height }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
