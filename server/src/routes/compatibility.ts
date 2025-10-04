import express, { Request, Response } from "express";
import { Engine } from "json-rules-engine";
import rules from "../controllers/compatibilityLogic.json";

const router = express.Router();

// ---------------- Part Type ----------------
type Part = {
  _id: string;
  name: string;
  specs?: {
    form_factor?: string;
    socket?: string;                 // CPU or single-socket cooler
    supported_sockets?: string[];    // multi-socket coolers
    tdp?: number;                    // CPU TDP
    cooler_tdp?: number;             // rated cooler TDP
    ddr?: string;
    ddr_speed?: number;
    wattage?: number;
    required_psu?: number;
    image_url?: string;
  };
};

type BuildState = Record<string, Part[]>;

// ---------- Helpers ----------
function normSocket(s?: string) {
  return s ? String(s).toUpperCase().replace(/\s+/g, "") : "UNKNOWN";
}
function coolerSocketList(cooler?: Part) {
  const single = cooler?.specs?.socket;
  const list = cooler?.specs?.supported_sockets;
  if (Array.isArray(list) && list.length) return list.map(normSocket);
  if (single) return [normSocket(single)];
  return [];
}

function toNum(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normDDR(d?: string) {
  return d ? String(d).toUpperCase() : "unknown";
}

function getFormFactorRank(ff?: string): number {
  if (!ff) return 0;
  const s = String(ff).toLowerCase().replace(/\s|-/g, ""); // normalize: "Micro ATX" -> "microatx"
  if (s === "atx") return 3;
  if (s === "matx" || s === "microatx") return 2;
  if (s === "mitx" || s === "miniitx" || s === "itx") return 1;
  return 0;
}

// NOTE: keeping this helper but NOT calling it to avoid creating placeholder parts
function normalizeDDR(build: BuildState) {
  const cpuDDR = build.processor?.[0]?.specs?.ddr;
  const mbDDR = build.motherboard?.[0]?.specs?.ddr;
  const ramDDR = build.ram?.[0]?.specs?.ddr;
  const commonDDR = cpuDDR || mbDDR || ramDDR;
  if (!commonDDR) return;
  if (!build.processor || build.processor.length === 0) {
    build.processor = [{ _id: "placeholder-cpu", name: "Auto-filled CPU DDR", specs: { ddr: commonDDR } }];
  } else {
    build.processor[0].specs = { ...build.processor[0].specs, ddr: build.processor[0].specs?.ddr || commonDDR };
  }
  if (!build.motherboard || build.motherboard.length === 0) {
    build.motherboard = [{ _id: "placeholder-mb", name: "Auto-filled Motherboard DDR", specs: { ddr: commonDDR } }];
  } else {
    build.motherboard[0].specs = { ...build.motherboard[0].specs, ddr: build.motherboard[0].specs?.ddr || commonDDR };
  }
  if (!build.ram || build.ram.length === 0) {
    build.ram = [{ _id: "placeholder-ram", name: "Auto-filled RAM DDR", specs: { ddr: commonDDR } }];
  } else {
    build.ram[0].specs = { ...build.ram[0].specs, ddr: build.ram[0].specs?.ddr || commonDDR };
  }
}

// ---------- Debug logger ----------
function logFacts(build: BuildState) {
  const snapshot = {
    caseFormFactorRank: getFormFactorRank(build.case?.[0]?.specs?.form_factor),
    mbFormFactorRank: getFormFactorRank(build.motherboard?.[0]?.specs?.form_factor),
    cpuDDR: normDDR(build.processor?.[0]?.specs?.ddr),
    mbDDR: normDDR(build.motherboard?.[0]?.specs?.ddr),
    ramDDR: normDDR(build.ram?.[0]?.specs?.ddr),
    ramSpeed: toNum(build.ram?.[0]?.specs?.ddr_speed),
    mbMaxRamSpeed: toNum(
      (build.motherboard?.[0]?.specs as any)?.max_ddr_speed ??
        build.motherboard?.[0]?.specs?.ddr_speed
    ),
    cpuMaxRamSpeed: toNum(
      (build.processor?.[0]?.specs as any)?.max_ddr_speed ??
        build.processor?.[0]?.specs?.ddr_speed
    ),
    psuWattage: toNum(build.psu?.[0]?.specs?.wattage),
    gpuRequiredWattage: toNum(build.gpu?.[0]?.specs?.required_psu),
    gpuRequiredWattagePlus100: toNum(build.gpu?.[0]?.specs?.required_psu) + 100,
    hasCpu: Boolean(build.processor?.[0]),
    hasCooler: Boolean(build.cooler?.[0]),
    cpuSocket: normSocket(build.processor?.[0]?.specs?.socket),
    coolerSockets: coolerSocketList(build.cooler?.[0]),
    cpuTdp: toNum(build.processor?.[0]?.specs?.tdp),
    coolerTdp: toNum(build.cooler?.[0]?.specs?.cooler_tdp),
  };
  console.log("🔍 Compatibility Facts Snapshot:", snapshot);
}

// ---------- Routes ----------

// GET /api/compatibility/rules → single source of truth for the frontend
router.get("/rules", (_req: Request, res: Response) => {
  res.json({
    version: "2025-10-04.1",
    rules, // your imported JSON from ../controllers/compatibilityLogic.json
  });
});

// POST /api/compatibility → run the rules engine
router.post("/", async (req: Request, res: Response) => {
  const build: BuildState = req.body?.build;
  if (!build || typeof build !== "object") {
    return res.status(400).json({ error: "Invalid or missing 'build' payload" });
  }

  // ❌ Do NOT call normalizeDDR(build);  // avoids phantom placeholder parts

  // Create engine from JSON rules
  const engine = new Engine(rules);

  // Ensure custom operator exists (some versions don't include it)
  try {
    engine.addOperator("greaterThanInclusive", (a: any, b: any) => {
      const A = toNum(a);
      const B = toNum(b);
      return A >= B;
    });
  } catch {
    // addOperator throws if operator already exists — safe to ignore
  }

  // Attach listeners for safer logging
  engine.on("error", (err) => {
    console.error("⚠️ Rules Engine internal error:", (err as any)?.stack || err);
  });

  // Register facts (numeric-safe, normalized)
  engine.addFact("caseFormFactorRank", () =>
    getFormFactorRank(build.case?.[0]?.specs?.form_factor)
  );
  engine.addFact("mbFormFactorRank", () =>
    getFormFactorRank(build.motherboard?.[0]?.specs?.form_factor)
  );

  engine.addFact("cpuDDR", () => normDDR(build.processor?.[0]?.specs?.ddr));
  engine.addFact("mbDDR", () => normDDR(build.motherboard?.[0]?.specs?.ddr));
  engine.addFact("ramDDR", () => normDDR(build.ram?.[0]?.specs?.ddr));

  engine.addFact("ramSpeed", () => toNum(build.ram?.[0]?.specs?.ddr_speed));
  engine.addFact("mbMaxRamSpeed", () =>
    toNum(
      (build.motherboard?.[0]?.specs as any)?.max_ddr_speed ??
        build.motherboard?.[0]?.specs?.ddr_speed
    )
  );
  engine.addFact("cpuMaxRamSpeed", () =>
    toNum(
      (build.processor?.[0]?.specs as any)?.max_ddr_speed ??
        build.processor?.[0]?.specs?.ddr_speed
    )
  );

  // Presence facts for cooler/CPU
  engine.addFact("hasCpu", () => Boolean(build.processor?.[0]));
  engine.addFact("hasCooler", () => Boolean(build.cooler?.[0]));

  // CPU & cooler sockets
  engine.addFact("cpuSocket", () => normSocket(build.processor?.[0]?.specs?.socket));
  engine.addFact("coolerSockets", () => coolerSocketList(build.cooler?.[0]));

  // KEY: treat as compatible until BOTH exist
  engine.addFact("coolerSupportsCpu", async (_p, almanac) => {
    const hasCpu = (await almanac.factValue("hasCpu")) as boolean;
    const hasCooler = (await almanac.factValue("hasCooler")) as boolean;
    if (!hasCpu || !hasCooler) return true;

    const cpu = (await almanac.factValue("cpuSocket")) as string;
    const sockets = (await almanac.factValue("coolerSockets")) as string[];
    return Array.isArray(sockets) && sockets.includes(cpu);
  });

  // TDP facts (optional)
  engine.addFact("cpuTdp", () => toNum(build.processor?.[0]?.specs?.tdp));
  engine.addFact("coolerTdp", () => toNum(build.cooler?.[0]?.specs?.cooler_tdp));

  // PSU/GPU
  engine.addFact("psuWattage", () => toNum(build.psu?.[0]?.specs?.wattage));
  engine.addFact("gpuRequiredWattage", () => toNum(build.gpu?.[0]?.specs?.required_psu));
  engine.addFact("gpuRequiredWattagePlus100", async (_params, almanac) => {
    const base = toNum(await almanac.factValue("gpuRequiredWattage"));
    return base + 100;
  });

  // Debug snapshot (optional)
  console.log("📦 Incoming build:", JSON.stringify(build, null, 2));
  logFacts(build);

  // Run engine & respond
  try {
    const { events } = await engine.run({});
    const issues = events.map((e: any) => ({
      type: (e.type as "error" | "warning" | "info") || "info",
      message: e.params?.message || "Unknown issue",
      affectedComponents: e.params?.affectedComponents || [],
    }));
    return res.json({ issues, build });
  } catch (err) {
    console.error("❌ Engine run failed:", err);
    return res
      .status(500)
      .json({ error: "Compatibility check failed", details: String(err) });
  }
});

export default router;
