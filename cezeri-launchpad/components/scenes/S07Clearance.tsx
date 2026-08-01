import { ClearanceForm } from "./ClearanceForm";
import { ScrollScene } from "./ScrollScene";

/** S07 — UÇUŞ İZİN FORMU. Kart değil, görev kontrol konsolu. */
export function S07Clearance() {
  return (
    <ScrollScene id="s07" index={6} className="bg-void py-24 md:py-32">
      <div className="px-6 md:px-16">
        <div className="mb-12 max-w-2xl">
          <p className="t-mono mb-4 text-ignition">07 / Uçuş İzni</p>
          <h2 className="t-display-l mb-6 text-cyber">Aday mühendis başvurusu</h2>
          <p className="font-body leading-relaxed text-ash">
            Formu dolduran her aday için uçuş ekibi bir ön görüşme planlar.
            Başvuru ücretsizdir ve bağlayıcı değildir.
          </p>
        </div>

        <div className="max-w-3xl">
          <ClearanceForm />
        </div>
      </div>
    </ScrollScene>
  );
}
