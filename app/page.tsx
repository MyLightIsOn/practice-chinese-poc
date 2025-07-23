import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-96 flex gap-5 items-center">
        <Label>Search</Label>
        <Input />
      </div>
    </main>
  );
}
