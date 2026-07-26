import { NextResponse } from "next/server";
import { DraftStateError } from "@hepsen/core";

/** transition()'dan gelen gecersiz durum gecisi -> 409; beklenmeyen hata -> 500. */
export function draftErrorResponse(e: unknown): NextResponse {
  if (e instanceof DraftStateError) {
    return NextResponse.json({ error: e.message }, { status: 409 });
  }
  return NextResponse.json({ error: e instanceof Error ? e.message : "Beklenmeyen hata" }, { status: 500 });
}
