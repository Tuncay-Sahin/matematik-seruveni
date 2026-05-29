export const MATH_TOPICS = [
  {
    id: "multiplication",
    title: "Çarpım Tablosu",
    description: "Sayıların dansını keşfet!",
    icon: "Grid3X3",
    color: "bg-orange-500",
  },
  {
    id: "fractions",
    title: "Pay ve Payda",
    description: "Parçaları birleştir, bütünü bul.",
    icon: "PieChart",
    color: "bg-blue-500",
  },
  {
    id: "percentages",
    title: "Yüzdeler",
    description: "Dünyayı yüzde olarak gör.",
    icon: "Percent",
    color: "bg-green-500",
  },
] as const;

export type TopicId = typeof MATH_TOPICS[number]["id"];
