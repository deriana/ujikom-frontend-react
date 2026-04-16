export const RANKS = [
  { name: "Discipline Legend", level: 50, min: 1000, next: 2000 },
  { name: "Discipline Elite", level: 25, min: 500, next: 1000 },
  { name: "Discipline Master", level: 15, min: 250, next: 500 },
  { name: "Discipline Pro", level: 10, min: 100, next: 250 },
  { name: "Discipline Starter", level: 1, min: 0, next: 100 },
] as const;

export const getRankInfo = (points: number) => {
  const rank = RANKS.find((r) => points >= r.min) || RANKS[RANKS.length - 1];
  return rank;
};

export const calculateRankProgress = (points: number) => {
  const rank = getRankInfo(points);
  const progress = Math.min(
    100,
    Math.max(
      0,
      ((points - rank.min) / (rank.next - rank.min)) * 100
    )
  );
  return progress;
};