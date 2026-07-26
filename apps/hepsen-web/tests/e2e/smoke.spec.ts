import { test, expect } from "@playwright/test";

test("giris sayfasi acilir ve form alanlarini gosterir", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("HEP-SEN Batman — Giriş")).toBeVisible();
  await expect(page.getByLabel("E-posta")).toBeVisible();
  await expect(page.getByLabel("Şifre")).toBeVisible();
  await expect(page.getByRole("button", { name: "Giriş yap" })).toBeVisible();
});

test("oturumsuz kullanici korumali panele giremez, /login'e yonlenir", async ({ page }) => {
  await page.goto("/today");
  await expect(page).toHaveURL(/\/login/);
});

test("/api/health erisilebilir ve ok doner", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBe(true);
  expect(await res.json()).toEqual({ status: "ok" });
});
