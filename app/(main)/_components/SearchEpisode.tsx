import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchEpisode({ searchEpisode, setSearchEpisode }: { searchEpisode: string, setSearchEpisode: (value: string) => void }) {
  return (
    <div className="relative">
         <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 hover:bg-transparent hover:cursor-pointer" onClick={() => setSearchEpisode(searchEpisode)}>
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Input
        type="text"
        placeholder="Tìm kiếm tập..."
        value={searchEpisode}
        onChange={(e) => setSearchEpisode(e.target.value)}
        className="w-full hover:bg-transparent pl-8"
      />
   
    </div>  
  )
}