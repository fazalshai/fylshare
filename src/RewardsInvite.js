import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Gift } from "lucide-react";
import config from "./config";
import {
  getParticipantToken,
  isInviteDismissed,
  dismissInvite,
  formatCampaignDate,
} from "./rewardsClient";

// Small, dismissible, optional invitation shown after a successful upload.
// Renders NOTHING unless the server reports a funded, validated, active campaign.
export default function RewardsInvite({ transfer }) {
  const [campaign, setCampaign] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [claimState, setClaimState] = useState("idle");
  const joined = Boolean(getParticipantToken());

  useEffect(() => {
    let cancelled = false;
    fetch(`${config.API_BASE_URL}/api/rewards/active-campaign`)
      .then((r) => (r.ok ? r.json() : { active: false }))
      .then((data) => {
        if (cancelled || !data?.active || !data.campaign) return;
        if (isInviteDismissed(data.campaign.campaignId) && !joined) return;
        setCampaign(data.campaign);
        if (!joined) {
          fetch(`${config.API_BASE_URL}/api/rewards/funnel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "impression" }),
          }).catch(() => {});
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [joined]);

  if (!campaign || hidden) return null;

  const handleDismiss = () => {
    dismissInvite(campaign.campaignId);
    setHidden(true);
    fetch(`${config.API_BASE_URL}/api/rewards/funnel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dismiss" }),
    }).catch(() => {});
  };

  // Already a verified participant: this upload was associated automatically via the participant session.
  if (joined) {
    return (
      <div className="rounded-xl border border-[#D2D2D7]/70 bg-[#F5F5F7] px-4 py-3 text-[12px] text-[#6E6E73] flex items-center justify-between gap-3">
        <span>
          This transfer is linked to your Fylshare Rewards activity. Points are calculated on our
          servers and may be held for review.
        </span>
        <Link to="/rewards" className="text-[#0066CC] font-medium shrink-0">
          View progress
        </Link>
      </div>
    );
  }

  const rules = campaign.scoringRules || {};
  const tz = campaign.timezone;

  return (
    <div
      role="region"
      aria-label="Optional Fylshare Rewards invitation"
      className="rounded-2xl border border-[#D2D2D7]/80 bg-white p-5 relative"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss rewards invitation"
        className="absolute top-3 right-3 p-1 rounded-md text-[#6E6E73] hover:bg-[#F5F5F7]"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Gift size={16} className="text-[#0066CC]" />
        <h3 className="text-[15px] font-semibold text-[#1D1D1F]">
          Optional: join Fylshare Rewards
        </h3>
      </div>

      <p className="text-[13px] text-[#1D1D1F] leading-relaxed mb-3">
        Earn points from qualifying file transfers and recipient downloads between{" "}
        {formatCampaignDate(campaign.startAt, tz)} and {formatCampaignDate(campaign.endAt, tz)} (
        {tz}). {campaign.prizeCount} eligible participants will receive {campaign.currency}{" "}
        {campaign.rewardValue} {campaign.marketplaceLabel} gift cards under the published ranking
        rules.
      </p>

      <ul className="text-[12px] text-[#6E6E73] space-y-1 mb-4 list-disc pl-4">
        <li>
          Eligible: {(campaign.eligibleCountries || []).join(", ")} ·{" "}
          {campaign.eligibilityRequirements}
        </li>
        <li>
          {rules.pointsPerTransfer} point per qualifying transfer (max {rules.maxTransfersPerDay}
          /day) · {rules.pointsPerDelivery} points per qualifying recipient download (max{" "}
          {rules.maxDeliveriesPerTransfer} per transfer).
        </li>
        <li>Joining does not guarantee a reward. Winners are ranked by activity, not signup order.</li>
        <li>Activity is checked for self-downloads, repeats, and automated abuse.</li>
        <li>
          Approved rewards are emailed to your verified address by{" "}
          {formatCampaignDate(campaign.deliveryDeadline, tz)}.
        </li>
        <li>Amazon is not a sponsor of this promotion.</li>
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={`/rewards?join=1${
            transfer?.code ? `&code=${encodeURIComponent(transfer.code)}` : ""
          }`}
          onClick={() => {
            // Keep the uploader's proof-of-ownership only in this tab so the transfer can be claimed after verification.
            try {
              if (transfer?.code && transfer?.revokeToken) {
                sessionStorage.setItem(
                  "fylshare_pending_claim",
                  JSON.stringify({ code: transfer.code, revokeToken: transfer.revokeToken })
                );
              }
            } catch {
              // ignore
            }
            setClaimState("navigating");
          }}
          className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[13px] font-semibold"
        >
          Join rewards
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="px-4 py-2 rounded-lg border border-[#D2D2D7] text-[13px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7]"
        >
          Continue without joining
        </button>
        <Link to="/rewards" className="text-[12px] text-[#0066CC] ml-auto">
          Full rules
        </Link>
      </div>
      {claimState === "navigating" && <span className="sr-only">Opening rewards…</span>}
    </div>
  );
}
