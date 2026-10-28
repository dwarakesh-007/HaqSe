// The legal areas HaqSe covers. Add a new area here + a file in legal-content/central/.

export type AreaId = "consumer" | "cyber-fraud" | "rti";

export type Area = {
  id: AreaId;
  title: string;
  emoji: string;
  example: string;
  template: string;
};

export const AREAS: Area[] = [
  {
    id: "consumer",
    title: "Consumer problems",
    emoji: "🛒",
    example: "I got a broken phone online and they won't refund me",
    template: "consumer-complaint-letter",
  },
  {
    id: "cyber-fraud",
    title: "Cyber fraud",
    emoji: "📱",
    example: "Someone took money from my UPI after a fake call",
    template: "cyber-complaint",
  },
  {
    id: "rti",
    title: "Right to Information",
    emoji: "📄",
    example: "I want to know why my scholarship hasn't come",
    template: "rti-application",
  },
];

export const STATES = [
  { code: "telangana", name: "Telangana" },
  { code: "andhra-pradesh", name: "Andhra Pradesh" },
];

export function getArea(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}
