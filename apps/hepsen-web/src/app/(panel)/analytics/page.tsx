import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Analiz</h1>
      <Card>
        <CardHeader>
          <CardTitle>Performans analizi henüz aktif değil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-hepsenNavy/60">
            Gönderi metrikleri, öğrenen zamanlama ve büyüme analizi Faz 4&apos;te eklenecek.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
