import { Switch } from "@/components/ui/switch";
import { SearchEpisode } from "../../_components/SearchEpisode";

interface SwitchEpisodeProps {
  isCompactEpisodes: boolean;
  setIsCompactEpisodes: (value: boolean) => void;
}

export function SwitchEpisode({ isCompactEpisodes, setIsCompactEpisodes }: SwitchEpisodeProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">Danh sách tập</h2>
      <div className="flex items-center gap-2">
        <span className="text-sm">Rút gọn</span>
        <Switch
          checked={isCompactEpisodes}
          onCheckedChange={setIsCompactEpisodes}
          className="data-[state=checked]:bg-[#FFD875]"
        />
      </div>
    </div>
  );
}