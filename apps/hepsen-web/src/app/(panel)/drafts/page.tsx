import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DraftsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Taslaklar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Taslak üretimi henüz aktif değil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-hepsenNavy/60">
            Gündem toplama, AI taslak üretimi ve onay akışı Faz 2-3&apos;te eklenecek.
            Bu ekran şu an için iskelet route&apos;tur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
