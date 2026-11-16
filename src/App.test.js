import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App, { AppContent } from "./App";
import {
  sanitizeUrlForAnalytics,
  sanitizeEventParams,
  setAnalyticsConsent,
  getAnalyticsConsent,
  trackEvent,
} from "./analytics";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  jest.restoreAllMocks();
});

test("1. Analytics module redacts codes, tokens, filenames, labels, PINs, and excludes /admin", () => {
  // Admin routes are excluded (return null)
  expect(sanitizeUrlForAnalytics("/admin")).toBeNull();
  expect(sanitizeUrlForAnalytics("/admin/transfers")).toBeNull();

  // Query parameters and 6-digit codes/tokens in paths are stripped/redacted
  expect(sanitizeUrlForAnalytics("/search?code=687179&token=secret12345678901234")).toBe(
    "/search"
  );
  expect(sanitizeUrlForAnalytics("/uploads/687179")).toBe("/uploads/[redacted_code]");

  // Forbidden parameters are stripped from GA4 events
  const sanitized = sanitizeEventParams({
    file_count: 6,
    size_bucket: "1-10MB",
    transfer_type: "anonymous",
    status: "available",
    code: "687179",
    token: "secret_share_token",
    pin: "9948",
    filename: "confidential_cv.pdf",
    label: "Abhishek",
    email: "user@example.com",
    downloadUrl: "https://storage.googleapis.com/secret",
  });

  expect(sanitized).toEqual({
    file_count: 6,
    size_bucket: "1-10MB",
    transfer_type: "anonymous",
    status: "available",
  });
  expect(sanitized.code).toBeUndefined();
  expect(sanitized.filename).toBeUndefined();
  expect(sanitized.label).toBeUndefined();
  expect(sanitized.pin).toBeUndefined();
});

test("2. Analytics consent defaults to undecided and respects explicit Decline vs Accept", () => {
  expect(getAnalyticsConsent()).toBeNull();

  setAnalyticsConsent("denied");
  expect(getAnalyticsConsent()).toBe("denied");

  // Disallowed event names are ignored
  expect(trackEvent("arbitrary_unapproved_event", { file_count: 1 })).toBeNull();
});

test("3. Homepage renders Apple-restrained Transfer & Receive interface without blocking legal wall", () => {
  render(<App />);

  expect(screen.getByText(/Files shared\. Simply\./i)).toBeInTheDocument();
  expect(
    screen.getByText(/Upload your files\. Share a code or QR\. No account required\./i)
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/Transfer label/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Avoid sensitive personal information in the label/i)
  ).toBeInTheDocument();

  // Optional analytics consent bar has both Decline and Accept buttons without blocking upload
  expect(screen.getByRole("button", { name: /Decline/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Accept Analytics/i })).toBeInTheDocument();
});

test("4. Recent transfers on this device separates local browser removal from server file deletion", async () => {
  const futureExpiry = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  localStorage.setItem(
    "fylshare_device_transfers_v2",
    JSON.stringify([
      {
        transferId: "tr_test_1",
        code: "123456",
        shareUrl: "https://fylshare.com/search?token=tok_1234567890123456",
        revokeToken: "rev_12345678901234567890",
        label: "Synthetic Package",
        fileCount: 3,
        totalBytes: 1048576,
        expiresAt: futureExpiry,
      },
    ])
  );

  render(<App />);

  expect(screen.getByText(/Recent transfers on this device/i)).toBeInTheDocument();
  expect(screen.getByText("123456")).toBeInTheDocument();
  expect(screen.getByText("Synthetic Package")).toBeInTheDocument();

  // Both distinct actions are clearly labelled
  const removeLocalBtn = screen.getByRole("button", { name: /Remove from browser/i });
  const deleteServerBtn = screen.getByRole("button", { name: /Delete server files/i });
  expect(removeLocalBtn).toBeInTheDocument();
  expect(deleteServerBtn).toBeInTheDocument();

  // Clicking "Remove from browser" clears local storage without calling DELETE/revoke on server
  fireEvent.click(removeLocalBtn);
  await waitFor(() => {
    expect(screen.queryByText("Synthetic Package")).not.toBeInTheDocument();
  });
});

test("5. Admin Console requires server authentication and displays separated Transfer vs File totals", async () => {
  jest.spyOn(global, "fetch").mockImplementation((url) => {
    if (String(url).includes("/api/admin/login")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          token: "signed_test_token",
          user: { username: "admin_operator", role: "admin" },
        }),
      });
    }
    if (String(url).includes("/api/admin/session")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          authenticated: true,
          user: { username: "admin_operator", role: "admin" },
        }),
      });
    }
    if (String(url).includes("/api/admin/transfers")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              id: "1",
              transferId: "tr_multi_6",
              transferType: "anonymous",
              label: "Six File Package",
              fileCount: 6,
              totalBytes: 6291456,
              status: "available",
              createdAt: "2026-11-15T17:03:21.014Z",
              expiresAt: "2026-11-17T17:03:21.014Z",
              countryCode: "IN",
              countryName: "India",
              locationSource: "legacy_record",
              deviceCategory: "desktop",
              retrievalCount: 2,
              downloadServedCount: 4,
              files: [],
            },
            {
              id: "2",
              transferId: "tr_unknown_loc",
              transferType: "anonymous",
              label: "Expired Transfer",
              fileCount: 1,
              totalBytes: 512000,
              status: "expired",
              createdAt: "2026-11-12T10:00:00.000Z",
              expiresAt: "2026-11-14T10:00:00.000Z",
              countryCode: null,
              countryName: "Unknown",
              locationSource: "unknown",
              deviceCategory: "mobile",
              retrievalCount: 1,
              downloadServedCount: 1,
              files: [],
            },
          ],
          pagination: {
            page: 1,
            pageSize: 25,
            totalItems: 2,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
          totals: {
            totalTransfers: 2,
            totalFiles: 7,
            totalBytes: 6803456,
            activeTransfers: 1,
            activeFiles: 6,
            historicalTransfers: 1,
            cleanupPendingCount: 0,
            totalWorkspaces: 4,
            openReportsCount: 0,
          },
          countryBreakdown: [
            { countryCode: "IN", countryName: "India", transfers: 1, files: 6, bytes: 6291456 },
            { countryCode: null, countryName: "Unknown", transfers: 1, files: 1, bytes: 512000 },
          ],
          dailySeries: [
            { date: "2026-11-15", transfers: 1, files: 6, bytes: 6291456 },
            { date: "2026-11-12", transfers: 1, files: 1, bytes: 512000 },
          ],
          trackingMetadata: {
            earliestRetainedRecordAt: "2026-11-12T10:00:00.000Z",
            selectedTimezone: "Asia/Dubai",
            note: "Active file contents expire after 48 hours while minimized operational history is retained.",
          },
        }),
      });
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => [],
    });
  });

  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <AppContent />
    </MemoryRouter>
  );

  // Initially renders login form
  expect(screen.getByText(/Fylshare Admin Console/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Username/i), {
    target: { value: "admin_operator" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "synthetic_pass" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

  // Wait for dashboard KPIs: 2 transfers vs 7 individual files
  await waitFor(() => {
    expect(screen.getByTestId("kpi-total-transfers")).toHaveTextContent("2");
  });
  expect(screen.getByTestId("kpi-total-files")).toHaveTextContent("7");
  expect(screen.getByText("Six File Package")).toBeInTheDocument();
  expect(screen.getAllByText("Unknown").length).toBeGreaterThan(0);
});
