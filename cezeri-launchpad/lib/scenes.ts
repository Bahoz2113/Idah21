/** Sahne meta verisi — HUD etiketi, ilerleme rayı ve klavye sıçraması bunu okur. */
export interface SceneMeta {
  readonly id: string;
  readonly label: string;
  /** Pinned sahnelerde scroll mesafesi (viewport yüksekliği katı). 0 = doğal akış. */
  readonly scrollLength: number;
}

export const SCENES: readonly SceneMeta[] = [
  { id: "s01", label: "01 / LAUNCHPAD", scrollLength: 3 },
  { id: "s02", label: "02 / ANATOMİ", scrollLength: 2.5 },
  { id: "s03", label: "03 / HANGAR", scrollLength: 4 },
  { id: "s04", label: "04 / İLK FIRLATIŞ", scrollLength: 3.5 },
  { id: "s05", label: "05 / PROTOTİPLER", scrollLength: 3 },
  { id: "s06", label: "06 / METODOLOJİ", scrollLength: 2.5 },
  { id: "s07", label: "07 / UÇUŞ İZNİ", scrollLength: 0 },
  { id: "s08", label: "08 / KULE", scrollLength: 0 },
];
