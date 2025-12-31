"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, Container, H1, Paragraph, Button, Input } from "@/components/ui";
import { useCurrencyStore } from "@/lib/stores/currency-store";
import type { Route } from "next";

type Region = "EU" | "UK" | "US";

export default function AccountClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const { currency } = useCurrencyStore();
  const region: Region = currency === "USD" ? "US" : currency === "GBP" ? "UK" : "EU";

  const setRegion = (newRegion: Region) => {
    const currencyMap: Record<Region, "EUR" | "GBP" | "USD"> = {
      EU: "EUR",
      UK: "GBP",
      US: "USD",
    };
    useCurrencyStore.getState().setCurrency(currencyMap[newRegion]);
  };

  const handleNavigate = (page: string) => {
    const target =
      page === "home"
        ? "/"
        : page.startsWith("/")
          ? page
          : `/${page}`;
    router.push(target as Route);
  };

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.error === "Wrong current password"
            ? "Current password is incorrect."
            : data?.error === "Invalid input"
              ? "Please check the fields and try again."
              : data?.error === "Password not set. Use reset instead."
                ? data.error
                : "Something went wrong. Please try again.";
        setError(msg);
        return;
      }
      setSuccess("Password updated. Please sign in again.");
      setTimeout(() => {
        void signOut({ callbackUrl: "/auth/sign-in" });
      }, 400);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <SiteHeader
        onNavigate={handleNavigate}
        region={region}
        setRegion={setRegion}
        balance={null}
        balanceLoading={false}
      />
      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="space-y-6 max-w-2xl">
            <div>
              <H1>Account</H1>
              <Paragraph className="mt-1">Manage your account and security settings.</Paragraph>
            </div>

            {/* Account card */}
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Account</h2>
              <div>
                <label className="text-sm font-medium opacity-80">Email</label>
                <Input
                  value={email}
                  readOnly
                  disabled
                  className="mt-1"
                />
                <p className="text-xs opacity-70 mt-1">Email cannot be changed right now.</p>
              </div>
            </Card>

            {/* Security card */}
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Security</h2>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg p-3 border"
                  style={{ borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)" }}
                >
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}
              {success && (
                <div
                  role="status"
                  className="rounded-lg p-3 border"
                  style={{ borderColor: "rgba(34,197,94,0.4)", background: "rgba(34,197,94,0.1)" }}
                >
                  <div className="text-sm text-green-200">{success}</div>
                </div>
              )}

              <form className="space-y-3" onSubmit={handleChangePassword}>
                <div className="space-y-1">
                  <label className="text-sm font-medium opacity-80" htmlFor="currentPassword">
                    Current password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium opacity-80" htmlFor="newPassword">
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium opacity-80" htmlFor="confirmNewPassword">
                    Confirm new password
                  </label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating…" : "Update password"}
                  </Button>
                  <a
                    href="/auth/reset-password"
                    className="text-xs underline opacity-80 hover:opacity-100"
                  >
                    Forgot your current password? Reset it →
                  </a>
                </div>
              </form>
            </Card>

              <div className="flex justify-between items-center">
                <div className="text-sm opacity-80">Sign out of your account.</div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
          </div>
        </Container>
      </main>
      <SiteFooter onNavigate={handleNavigate} />
    </div>
  );
}
