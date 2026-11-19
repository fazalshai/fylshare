import React, { useCallback, useEffect, useState } from "react";
import config from "./config";

const box = "rounded-2xl border border-[#D2D2D7]/70 bg-white p-5";
const lbl = "block text-[11px] font-medium text-[#6E6E73] mb-1";
const inp =
  "w-full px-2.5 py-1.5 rounded-lg border border-[#D2D2D7] text-[13px] text-[#1D1D1F] bg-white";
const btn =
  "px-3 py-1.5 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[12px] font-semibold disabled:opacity-50";
const btn2 =
  "px-3 py-1.5 rounded-lg border border-[#D2D2D7] text-[12px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-50";

const TIE_POLICIES = [
  { v: "", l: "— Not set (required before activation) —" },
  { v: "extend_budget_for_tied_ranks", l: "Extend budget for tied ranks (needs funded reserve)" },
  { v: "split_equally_within_budget", l: "Split the remaining prize pool equally" },
  { v: "strict_secondary_metrics_then_split", l: "Secondary metrics, then split equally" },
];

function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function emptyForm() {
  // Country, currency, reward value, budget, dates and legal eligibility stay UNSET until the owner supplies them.
  return {
    name: "",
    startAt: "",
    endAt: "",
    timezone: "",
    eligibleCountries: "",
    eligibilityRequirements: "",
    marketplace: "",
    currency: "",
    rewardValue: "",
    prizeCount: "",
    fundedBudget: "",
    expectedFees: "0",
    tiePolicy: "",
    tieReserveBudget: "0",
    reviewPeriodDays: "7",
    deliveryDeadline: "",
    rulesVersion: "1.0-draft",
    supportContact: "",
    personalDataRetentionDays: "180",
    legalAndBrandReviewConfirmed: false,
    fundingVerifiedByOwner: false,
    pointsPerTransfer: "1",
    pointsPerDelivery: "2",
    maxDeliveriesPerTransfer: "3",
    maxTransfersPerDay: "5",
  };
}

function formFromCampaign(c) {
  return {
    name: c.name || "",
    startAt: toLocalInput(c.startAt),
    endAt: toLocalInput(c.endAt),
    timezone: c.timezone || "",
    eligibleCountries: (c.eligibleCountries || []).join(", "),
    eligibilityRequirements: c.eligibilityRequirements || "",
    marketplace: c.marketplace || "",
    currency: c.currency || "",
    rewardValue: c.rewardValue ?? "",
    prizeCount: c.prizeCount ?? "",
    fundedBudget: c.fundedBudget ?? "",
    expectedFees: c.expectedFees ?? "0",
    tiePolicy: c.tiePolicy || "",
    tieReserveBudget: c.tieReserveBudget ?? "0",
    reviewPeriodDays: c.reviewPeriodDays ?? "7",
    deliveryDeadline: toLocalInput(c.deliveryDeadline),
    rulesVersion: c.rulesVersion || "",
    supportContact: c.supportContact || "",
    personalDataRetentionDays: c.personalDataRetentionDays ?? "180",
    legalAndBrandReviewConfirmed: Boolean(c.legalAndBrandReviewConfirmed),
    fundingVerifiedByOwner: Boolean(c.fundingVerifiedByOwner),
    pointsPerTransfer: c.scoringRules?.pointsPerTransfer ?? "1",
    pointsPerDelivery: c.scoringRules?.pointsPerDelivery ?? "2",
    maxDeliveriesPerTransfer: c.scoringRules?.maxDeliveriesPerTransfer ?? "3",
    maxTransfersPerDay: c.scoringRules?.maxTransfersPerDay ?? "5",
  };
}

function formToPayload(f, includeLocked) {
  const toIso = (v) => (v ? new Date(v).toISOString() : null);
  const payload = {
    name: f.name,
    startAt: toIso(f.startAt),
    endAt: toIso(f.endAt),
    fundedBudget: f.fundedBudget === "" ? null : Number(f.fundedBudget),
    expectedFees: Number(f.expectedFees) || 0,
    tieReserveBudget: Number(f.tieReserveBudget) || 0,
    reviewPeriodDays: Number(f.reviewPeriodDays) || 7,
    deliveryDeadline: toIso(f.deliveryDeadline),
    rulesVersion: f.rulesVersion,
    supportContact: f.supportContact || null,
    personalDataRetentionDays: Number(f.personalDataRetentionDays) || 180,
    legalAndBrandReviewConfirmed: f.legalAndBrandReviewConfirmed,
    fundingVerifiedByOwner: f.fundingVerifiedByOwner,
  };
  if (includeLocked) {
    Object.assign(payload, {
      timezone: f.timezone || null,
      eligibleCountries: f.eligibleCountries
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      eligibilityRequirements: f.eligibilityRequirements || null,
      marketplace: f.marketplace || null,
      currency: f.currency || null,
      rewardValue: f.rewardValue === "" ? null : Number(f.rewardValue),
      prizeCount: f.prizeCount === "" ? null : Number(f.prizeCount),
      tiePolicy: f.tiePolicy || null,
      scoringRules: {
        pointsPerTransfer: Number(f.pointsPerTransfer),
        pointsPerDelivery: Number(f.pointsPerDelivery),
        maxDeliveriesPerTransfer: Number(f.maxDeliveriesPerTransfer),
        maxTransfersPerDay: Number(f.maxTransfersPerDay),
      },
    });
  }
  return payload;
}

export default function AdminCampaigns({ token, isAdmin }) {
  const [campaigns, setCampaigns] = useState([]);
  const [marketplaces, setMarketplaces] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [participants, setParticipants] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [report, setReport] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [newCode, setNewCode] = useState("");

  const call = useCallback(
    async (path, method = "GET", body) => {
      const res = await fetch(`${config.API_BASE_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, data };
    },
    [token]
  );

  const loadList = useCallback(async () => {
    const { ok, data } = await call("/api/admin/campaigns");
    if (ok) {
      const list = data.campaigns || [];
      setCampaigns(list);
      setMarketplaces(data.supportedMarketplaces || {});
      if (list.length > 0) {
        setSelectedId((prev) => prev || list[0].campaignId);
      }
    }
  }, [call]);

  const selected = campaigns.find((c) => c.campaignId === selectedId) || null;

  const loadDetail = useCallback(
    async (id) => {
      if (!id) return;
      const [p, e, inv] = await Promise.all([
        call(`/api/admin/campaigns/${id}/participants`),
        call(`/api/admin/campaigns/${id}/effectiveness`),
        isAdmin ? call(`/api/admin/campaigns/${id}/inventory`) : Promise.resolve({ ok: false }),
      ]);
      setParticipants(p.ok ? p.data : null);
      setReport(e.ok ? e.data : null);
      setInventory(inv.ok ? inv.data.inventory || [] : []);
    },
    [call, isAdmin]
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (selected) {
      setForm(formFromCampaign(selected));
      loadDetail(selected.campaignId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const isDraft = !selected || selected.status === "draft";

  const save = async () => {
    setBusy(true);
    setMsg("");
    const payload = formToPayload(form, isDraft);
    const res = selected
      ? await call(`/api/admin/campaigns/${selected.campaignId}`, "PUT", { ...payload, reason: "Admin edit" })
      : await call("/api/admin/campaigns", "POST", payload);
    setBusy(false);
    if (!res.ok) return setMsg(res.data.error || "Save failed");
    setMsg("Saved.");
    await loadList();
    setSelectedId(res.data.campaign.campaignId);
  };

  const changeStatus = async (action) => {
    const reason = window.prompt(`Reason for "${action}" (recorded in the audit log):`);
    if (!reason) return;
    const { ok, data } = await call(`/api/admin/campaigns/${selected.campaignId}/status`, "POST", { action, reason });
    setMsg(ok ? data.message : `${data.error}${data.validationErrors ? `\n• ${data.validationErrors.join("\n• ")}` : ""}`);
    await loadList();
    loadDetail(selected.campaignId);
  };

  const review = async (participantId, action) => {
    const reason = window.prompt(`Documented reason for "${action}":`);
    if (!reason) return;
    let pointAdjustment = 0;
    if (action === "adjust_points") {
      pointAdjustment = Number(window.prompt("Point adjustment (e.g. -2 or 3):", "0")) || 0;
    }
    const { ok, data } = await call(
      `/api/admin/campaigns/${selected.campaignId}/participants/${participantId}/review`,
      "POST",
      { action, reason, pointAdjustment }
    );
    setMsg(ok ? data.message : data.error);
    loadDetail(selected.campaignId);
  };

  const addInventory = async () => {
    const isTest = newCode.startsWith("TEST-FIXTURE-");
    if (!isTest && !window.confirm("This does not look like a test fixture. Only add codes legitimately purchased from an authorized source. Continue?")) return;
    const { ok, data } = await call(`/api/admin/campaigns/${selected.campaignId}/inventory`, "POST", {
      claimCode: newCode,
      isTestFixture: isTest,
      sourceReference: isTest ? "TEST_FIXTURE_NON_REDEEMABLE" : "AUTHORIZED_PURCHASE",
    });
    setMsg(ok ? `Added ${data.codeMasked}` : data.error);
    setNewCode("");
    loadDetail(selected.campaignId);
  };

  const approveBatch = async () => {
    if (!window.confirm("Approve the fulfillment batch for all eligible participants shown? This commits rewards against the funded budget.")) return;
    const { ok, data } = await call(`/api/admin/campaigns/${selected.campaignId}/approve-fulfillment`, "POST", { reason: "Owner-approved fulfillment batch" });
    setMsg(ok ? data.message : data.error);
    await loadList();
    loadDetail(selected.campaignId);
  };

  const dispatch = async () => {
    if (!window.confirm("Send approved rewards to each verified delivery email now?")) return;
    const { ok, data } = await call(`/api/admin/campaigns/${selected.campaignId}/dispatch-rewards`, "POST", {});
    setMsg(ok ? `${data.message} ${(data.results || []).map((r) => `${r.rewardId}: ${r.status}${r.error ? ` (${r.error})` : ""}`).join("; ")}` : data.error);
    await loadList();
    loadDetail(selected.campaignId);
  };

  const v = selected?.validation;

  return (
    <div className="space-y-5">
      <div className={`${box} flex flex-wrap items-center gap-2`}>
        <span className="text-[13px] font-semibold mr-2">Campaigns</span>
        {campaigns.map((c) => (
          <button
            key={c.campaignId}
            type="button"
            onClick={() => setSelectedId(c.campaignId)}
            className={`px-3 py-1.5 rounded-lg text-[12px] border ${selectedId === c.campaignId ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "border-[#D2D2D7]"}`}
          >
            {c.name} · {c.status}
          </button>
        ))}
        {isAdmin && (
          <button type="button" className={btn2} onClick={() => { setSelectedId(null); setForm(emptyForm()); setParticipants(null); setReport(null); }}>
            + New draft
          </button>
        )}
        <span className="ml-auto text-[11px] text-[#6E6E73]">
          Production activation and reward dispatch are locked server-side until the owner enables them.
        </span>
      </div>

      {/* Configuration */}
      <div className={box}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold">{selected ? `Configure: ${selected.name}` : "New draft campaign"}</h3>
          {selected && <span className="text-[12px] text-[#6E6E73]">Status: <strong>{selected.status}</strong> · scoring v{selected.scoringRules?.version}</span>}
        </div>
        {!isDraft && (
          <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            Scoring, eligibility, prizes, reward value, marketplace, tie policy and timezone are locked once a campaign leaves draft. Changes require a new campaign.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2"><label className={lbl}>Campaign name</label><input className={inp} value={form.name} onChange={set("name")} /></div>
          <div><label className={lbl}>Published rules version</label><input className={inp} value={form.rulesVersion} onChange={set("rulesVersion")} /></div>
          <div><label className={lbl}>Start</label><input type="datetime-local" className={inp} value={form.startAt} onChange={set("startAt")} /></div>
          <div><label className={lbl}>End</label><input type="datetime-local" className={inp} value={form.endAt} onChange={set("endAt")} /></div>
          <div><label className={lbl}>Campaign timezone (IANA)</label><input className={inp} placeholder="e.g. Asia/Dubai" disabled={!isDraft} value={form.timezone} onChange={set("timezone")} /></div>
          <div><label className={lbl}>Eligible countries (ISO, comma-separated)</label><input className={inp} placeholder="e.g. AE" disabled={!isDraft} value={form.eligibleCountries} onChange={set("eligibleCountries")} /></div>
          <div className="sm:col-span-2"><label className={lbl}>Eligibility requirements (legal)</label><input className={inp} disabled={!isDraft} value={form.eligibilityRequirements} onChange={set("eligibilityRequirements")} /></div>
          <div>
            <label className={lbl}>Amazon marketplace</label>
            <select className={inp} disabled={!isDraft} value={form.marketplace} onChange={(e) => { const m = e.target.value; setForm((f) => ({ ...f, marketplace: m, currency: marketplaces[m]?.currency || f.currency })); }}>
              <option value="">— Not set —</option>
              {Object.entries(marketplaces).map(([k, m]) => (<option key={k} value={k}>{m.label} · min {m.minDenomination} {m.currency}</option>))}
            </select>
          </div>
          <div><label className={lbl}>Currency</label><input className={inp} disabled={!isDraft} value={form.currency} onChange={set("currency")} /></div>
          <div><label className={lbl}>Reward value (per prize)</label><input type="number" className={inp} disabled={!isDraft} value={form.rewardValue} onChange={set("rewardValue")} /></div>
          <div><label className={lbl}>Number of prizes</label><input type="number" className={inp} disabled={!isDraft} value={form.prizeCount} onChange={set("prizeCount")} /></div>
          <div><label className={lbl}>Total funded reward budget</label><input type="number" className={inp} value={form.fundedBudget} onChange={set("fundedBudget")} /></div>
          <div><label className={lbl}>Expected provider fees</label><input type="number" className={inp} value={form.expectedFees} onChange={set("expectedFees")} /></div>
          <div className="sm:col-span-2">
            <label className={lbl}>Tie policy at prize boundary</label>
            <select className={inp} disabled={!isDraft} value={form.tiePolicy} onChange={set("tiePolicy")}>
              {TIE_POLICIES.map((t) => (<option key={t.v} value={t.v}>{t.l}</option>))}
            </select>
          </div>
          <div><label className={lbl}>Tie reserve budget</label><input type="number" className={inp} value={form.tieReserveBudget} onChange={set("tieReserveBudget")} /></div>
          <div><label className={lbl}>Points / qualifying transfer</label><input type="number" className={inp} disabled={!isDraft} value={form.pointsPerTransfer} onChange={set("pointsPerTransfer")} /></div>
          <div><label className={lbl}>Points / qualifying recipient download</label><input type="number" className={inp} disabled={!isDraft} value={form.pointsPerDelivery} onChange={set("pointsPerDelivery")} /></div>
          <div><label className={lbl}>Max rewarded downloads / transfer</label><input type="number" className={inp} disabled={!isDraft} value={form.maxDeliveriesPerTransfer} onChange={set("maxDeliveriesPerTransfer")} /></div>
          <div><label className={lbl}>Max qualifying transfers / day</label><input type="number" className={inp} disabled={!isDraft} value={form.maxTransfersPerDay} onChange={set("maxTransfersPerDay")} /></div>
          <div><label className={lbl}>Review period (days)</label><input type="number" className={inp} value={form.reviewPeriodDays} onChange={set("reviewPeriodDays")} /></div>
          <div><label className={lbl}>Delivery deadline</label><input type="datetime-local" className={inp} value={form.deliveryDeadline} onChange={set("deliveryDeadline")} /></div>
          <div><label className={lbl}>Support contact email</label><input className={inp} value={form.supportContact} onChange={set("supportContact")} /></div>
          <div><label className={lbl}>Reward data retention (days)</label><input type="number" className={inp} value={form.personalDataRetentionDays} onChange={set("personalDataRetentionDays")} /></div>
        </div>
        <div className="flex flex-col gap-1.5 mt-3 text-[12px]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.legalAndBrandReviewConfirmed} onChange={set("legalAndBrandReviewConfirmed")} /> Promotion rules, permissions and brand-use reviewed for the eligible market(s)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.fundingVerifiedByOwner} onChange={set("fundingVerifiedByOwner")} /> Owner confirms the reward budget is funded</label>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" className={btn} disabled={busy} onClick={save}>{selected ? "Save changes" : "Create draft"}</button>
            {selected && ["draft", "paused"].includes(selected.status) && <button type="button" className={btn2} onClick={() => changeStatus(selected.status === "paused" ? "resume" : "activate")}>{selected.status === "paused" ? "Resume" : "Activate"}</button>}
            {selected?.status === "active" && <button type="button" className={btn2} onClick={() => changeStatus("pause")}>Pause campaign</button>}
            {selected && ["active", "paused"].includes(selected.status) && <button type="button" className={btn2} onClick={() => changeStatus("close")}>Close & freeze scores</button>}
            {selected?.status === "closed" && <button type="button" className={btn2} onClick={() => changeStatus("mark_reviewed")}>Mark fraud review complete</button>}
          </div>
        )}
        {v && (
          <div className={`mt-4 rounded-lg px-3 py-2 text-[12px] ${v.valid ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-[#F5F5F7] text-[#1D1D1F] border border-[#D2D2D7]"}`}>
            {v.valid ? "Configuration passes activation checks." : (<><strong>Activation blocked until:</strong><ul className="list-disc pl-5 mt-1">{v.errors.map((e) => <li key={e}>{e}</li>)}</ul></>)}
          </div>
        )}
        {selected?.alerts?.length > 0 && (
          <div className="mt-3 rounded-lg px-3 py-2 text-[12px] bg-red-50 text-red-800 border border-red-200">
            <strong>Alerts:</strong>
            <ul className="list-disc pl-5">{selected.alerts.map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
        )}
        {msg && <pre className="mt-3 whitespace-pre-wrap text-[12px] text-[#6E6E73]">{msg}</pre>}
      </div>

      {/* Effectiveness report */}
      {report && (
        <div className={box}>
          <h3 className="text-[15px] font-semibold">{report.centralCommercialQuestion}</h3>
          <p className="text-[11px] text-[#6E6E73] mb-3">{report.methodologyDisclaimer}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
            {[
              ["Shown invitation", report.funnel.visitorsShownInvitation],
              ["Enrollment starts", report.funnel.enrollmentStarts],
              ["Verified participants", report.funnel.verifiedParticipants],
              ["Suspicious participants", report.integrityAndAbuse.participantsWithSuspiciousFlags],
              ["Incentivized transfers", report.activityComparison.incentivized.transfers],
              ["Organic transfers", report.activityComparison.organicWithoutRewards.transfers],
              ["Qualifying recipient downloads", report.activityComparison.incentivized.qualifyingRecipientDeliveries],
              ["Rewards committed / delivered", `${report.financialsAndFulfillment.rewardsCommittedCount} / ${report.financialsAndFulfillment.rewardsDeliveredCount}`],
              ["Cost committed", `${report.financialsAndFulfillment.currency || ""} ${report.financialsAndFulfillment.totalCostCommitted}`],
              ["Repeat use after reward", report.postRewardRetention.participantsWithRepeatActivityAfterReward],
              ["7-day / 30-day retention", `${report.postRewardRetention.retainedWithin7DaysPct}% / ${report.postRewardRetention.retainedWithin30DaysPct}%`],
              ["Cost per retained participant", report.postRewardRetention.costPerRetainedParticipant ?? "Not yet measurable"],
            ].map(([k, val]) => (
              <div key={k} className="rounded-xl bg-[#F5F5F7] p-3">
                <p className="text-[10.5px] uppercase tracking-wider text-[#6E6E73]">{k}</p>
                <p className="text-[16px] font-semibold text-[#1D1D1F]">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants & rankings */}
      {participants && (
        <div className={box}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-semibold">Participants & activity ranking</h3>
            <span className="text-[11px] text-[#6E6E73]">
              {participants.snapshotFrozenAt ? `Snapshot frozen ${new Date(participants.snapshotFrozenAt).toLocaleString()}` : "Provisional"} · ranked by approved points → recipient downloads → active days (never signup order)
            </span>
          </div>
          {participants.boundaryTieAlert && <p className="text-[12px] text-red-700 mb-2">{participants.boundaryTieAlert}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-[11.5px]">
              <thead className="text-left text-[#6E6E73]">
                <tr>
                  {["Rank", "Participant", "Verified email", "Transfers / files", "Download req. / sessions (est.)", "Qualifying T / D / days", "Points (approved · pending)", "Review", "Appeal", "Reward", ""].map((h) => <th key={h} className="py-1.5 pr-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {participants.participants.map((p) => (
                  <tr key={p.participantId} className="border-t border-[#D2D2D7]/60 align-top">
                    <td className="py-1.5 pr-3">{p.rank ? `#${p.rank}` : "—"}{p.withinPrizeCutoff && <span className="ml-1 text-emerald-700">●</span>}</td>
                    <td className="py-1.5 pr-3 font-mono">{p.participantId}</td>
                    <td className="py-1.5 pr-3">{p.email} {p.emailVerified ? "✓" : "(unverified)"}<br /><span className="text-[#6E6E73]">declared {p.declaredCountry || "—"} · IP≈{p.approxIpCountry || "—"}</span></td>
                    <td className="py-1.5 pr-3">{p.successfulTransfers} / {p.individualFilesUploaded}</td>
                    <td className="py-1.5 pr-3">{p.downloadRequests} / {p.estimatedDistinctRecipientSessions}</td>
                    <td className="py-1.5 pr-3">{p.qualifyingTransfers} / {p.qualifyingRecipientDeliveries} / {p.qualifyingActiveDaysCount}</td>
                    <td className="py-1.5 pr-3">{p.approvedPoints} · {p.pendingReviewPoints}{p.manualAdjustmentPoints ? ` (adj ${p.manualAdjustmentPoints})` : ""}</td>
                    <td className="py-1.5 pr-3">{p.fraudStatus}{p.suspiciousFlags?.length ? <><br /><span className="text-amber-700">{p.suspiciousFlags.join(", ")}</span></> : null}</td>
                    <td className="py-1.5 pr-3">{p.appealStatus}{p.appealMessage ? <><br /><span className="text-[#6E6E73]">"{p.appealMessage}"</span></> : null}</td>
                    <td className="py-1.5 pr-3">{p.rewardStatus}{p.rewardDetails ? <><br />{p.rewardDetails.currency} {p.rewardDetails.amount}</> : null}</td>
                    <td className="py-1.5 pr-3 whitespace-nowrap">
                      {isAdmin && (
                        <select className="text-[11px] border border-[#D2D2D7] rounded px-1 py-0.5" value="" onChange={(e) => e.target.value && review(p.participantId, e.target.value)}>
                          <option value="">Review…</option>
                          <option value="clear">Clear</option>
                          <option value="flag">Flag</option>
                          <option value="adjust_points">Adjust points</option>
                          <option value="uphold_appeal">Uphold appeal</option>
                          <option value="reject_appeal">Reject appeal</option>
                          <option value="disqualify">Disqualify</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
                {participants.participants.length === 0 && (<tr><td colSpan={11} className="py-3 text-[#6E6E73]">No participants yet.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fulfillment */}
      {isAdmin && selected && ["closed", "reviewed", "fulfilled"].includes(selected.status) && (
        <div className={box}>
          <h3 className="text-[15px] font-semibold mb-1">Gift-card fulfillment (manual approval)</h3>
          <p className="text-[11px] text-[#6E6E73] mb-3">
            Codes are encrypted at rest and only the last 4 characters are shown. Use only cards purchased from an authorized source, or "TEST-FIXTURE-…" codes in staging. Never enter generated or invented Amazon codes.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <input className={`${inp} max-w-xs`} placeholder="Claim code (TEST-FIXTURE-… in staging)" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
            <button type="button" className={btn2} disabled={!newCode} onClick={addInventory}>Add to inventory</button>
            <button type="button" className={btn} onClick={approveBatch}>Approve fulfillment batch</button>
            <button type="button" className={btn} onClick={dispatch}>Dispatch approved rewards</button>
          </div>
          <p className="text-[12px] mb-2">
            Inventory: {inventory.filter((c) => c.status === "available").length} available ·{" "}
            {inventory.filter((c) => c.status === "assigned").length} assigned · budget {selected.currency} {selected.fundedBudget ?? "—"}
          </p>
          <ul className="text-[11.5px] space-y-1">
            {inventory.map((c) => (
              <li key={c.cardId} className="font-mono">{c.cardId} · {c.currency} {c.amount} · {c.codeMasked} · {c.status}{c.isTestFixture ? " · test fixture" : ""}{c.assignedParticipantId ? ` → ${c.assignedParticipantId}` : ""}</li>
            ))}
          </ul>
          {participants && (
            <div className="mt-3 text-[11.5px]">
              <p className="font-semibold mb-1">Pre-dispatch review</p>
              {participants.participants.filter((p) => p.rewardDetails).map((p) => (
                <p key={p.participantId}>#{p.rank} {p.participantId} → {p.email} · {p.rewardDetails.marketplace} · {p.rewardDetails.currency} {p.rewardDetails.amount} · {p.rewardDetails.status}{p.rewardDetails.lastError ? ` · ${p.rewardDetails.lastError}` : ""}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

