import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Takvim</h1>
      <Card>
        <CardHeader>
          <CardTitle>Zamanlama motoru henüz aktif değil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-hepsenNavy/60">
            Akıllı yayın zamanı önerisi ve planlanmış paylaşım takvimi Faz 3-4&apos;te eklenecek.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
