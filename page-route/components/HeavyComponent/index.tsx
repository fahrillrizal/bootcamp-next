import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import ImgHigh from "@/assets/IMG_7192.HEIC";

export default function HeavyComponent() {
  const [data, setData] = useState<number[]>([]);

  function expensiveCalculation(n: number): number {
    if (n <= 1) return n;
    return expensiveCalculation(n - 1) + expensiveCalculation(n - 2);
  }

  useEffect(() => {
    const calculatedData = Array.from({ length: 100 }, (_, i) =>
      expensiveCalculation(i)
    );
    setData(calculatedData);
  }, []);
  return (
    <div>
      <h1>Heavy Component</h1>
      <Line
        data={{
          labels: data.map((_, i) => i),
          datasets: [
            {
              label: data.map((_, i) => "Step ${i}"),
              datasets: [{ label: "Fibonacci", data, borderColor: "blue" }],
            },
          ],
        }}
      />
      <img src={...ImgHigh} />
      <p>Data Fibonacci (berat dihitung): {JSON.stringify(data)}</p>
    </div>
  );
}
