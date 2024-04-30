"use client";

import { DonutChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { getPieChart } from "@/utils/events";

interface chartResp {
  [key: string]: number;
}

interface ConvertedData {
  name: string;
  value: number;
  color: string;
}

export default function PieChart(props: any) {
  const [data, setData] = useState<ConvertedData[]>([]);

  const colorMapping: { [key: string]: string } = {
    Accepted: "#3AB876",
    Rejected: "#F46E47",
    "No Reply": "#ffca11",
    "In Progress": "#7F5DFF",
    "Not Contacted": "#414141",
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp: chartResp = await getPieChart(
        props.accessToken,
        props.event_id
      );
      const data = resp
        ? Object.entries(resp).map(([name, value]) => ({
            name,
            value,
            color: colorMapping[name] || "#000000",
          }))
        : [];
      setData(data);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-start">
      <p className="w-full text-center font-bold text-lg">
        Response Statistics
      </p>
      {data.length === 0 ? (
        <p>Not data available</p>
      ) : (
        <>
          <DonutChart
            data={data}
            className="w-[200px] h-[200px] p-0"
            tooltipDataSource="segment"
            thickness={30}
          />
          <div className="flex flex-wrap w-full items-center justify-center gap-2">
            {Object.entries(colorMapping).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-4 rounded-full h-4" style={{ backgroundColor: color }} />
                <p>{name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
