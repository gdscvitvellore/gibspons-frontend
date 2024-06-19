"use client";

import { getLeaderBoard } from "@/utils/events";
import { useEffect, useState } from "react";

type leaderboard = {
  user: number;
  event: number;
  points: number;
  user_name: string;
  event_name: string;
};

export default function Leaderboard({
  event_id,
}: Readonly<{ event_id: number }>) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data: leaderboard[] = await getLeaderBoard(event_id);
        const sortedData = data.sort((a, b) => b.points - a.points);
        setData(sortedData);
      } catch (e) {
        console.log(e);
      }
    };
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-start p-4 gap-4">
      <h1 className="w-full text-center font-bold text-lg">Team Leaderboard 🏆</h1>
      {data?.map((row: leaderboard, index: number) => (
        <div
          key={row.user}
          className="flex flex-row justify-between w-full p-2"
        >
          <div className="flex flex-row gap-4 font-semibold">
            <p>{index + 1}</p>
            <p>{row.user_name}</p>
          </div>
          <p>{row.points} pts</p>
        </div>
      ))}
    </div>
  );
}
