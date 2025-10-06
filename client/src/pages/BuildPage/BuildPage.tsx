import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast from "react-hot-toast";
import { useServerRules } from "@/hooks/useServerRules";
import API from "@/utils/api";

// ✨ shadcn/ui Imports: Add these to your component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

// ---------------- TYPES ----------------
type Part = {
  _id: string;
  name: string;
  specs?: {
    form_factor?: string;
    socket?: string;
    tdp?: number;
    ddr?: string;
    ddr_speed?: number;
    wattage?: number;
    required_psu?: number;
    image_url?: string;
    supported_sockets?: string[];
    cooler_tdp?: number;
  };
};

type BuildState = Record<string, any[]>;

// returns "ATX " | "mATX " | null
function ffPrefix(ffRaw?: string): string | null {
  if (!ffRaw) return null;
  const s = String(ffRaw).toLowerCase().replace(/\s+/g, "");
  if (s.includes("matx") || s.includes("microatx")) return "mATX ";
  if (s.includes("atx")) return "ATX ";
  return null;
}

function getBuildStageImages(build: BuildState): string[] {
  if (!build.case || build.case.length === 0) {
    return ["/images/buildStages/Case Only.png"];
  }

  const casePref = ffPrefix(build.case?.[0]?.specs?.form_factor); // "ATX " | "mATX " | null
  const mbPref = ffPrefix(build.motherboard?.[0]?.specs?.form_factor); // "ATX " | "mATX " | null

  const caseLabel = `${casePref ?? ""}Case`;

  const partsExact: string[] = [caseLabel];
  if (build.motherboard?.length) {
    partsExact.push(mbPref ? `${mbPref}Motherboard` : "Motherboard");
  }
  if (build.processor?.length) partsExact.push("CPU");
  if (build.ram?.length) partsExact.push("RAM");
  if (build.storage?.length) partsExact.push("NVME");
  if (build.gpu?.length) partsExact.push("GPU");

  // ✅ UPDATED: dynamically choose ICooler or Cooler
  if (build.cooler?.length) {
    const cpu = build.processor?.[0];
    const cpuName = cpu?.name?.toLowerCase() || "";
    const isIntel =
      cpuName.includes("intel") ||
      /^i[3579]-\d{3,5}/.test(cpuName); // catches "i5-12400F", "i7-12700K", etc.
    partsExact.push(isIntel ? "ICooler" : "Cooler");
  }

  if (build.psu?.length) partsExact.push("PSU");

  const candidates = new Set<string>();

  // push an ordered set of variants:
  // 1) exact (case + specific MB)
  // 2) generic MB fallback ("Motherboard")
  // 3) generic everything (strip ATX/mATX prefixes)
  const pushVariants = (arr: string[]) => {
    // exact
    candidates.add(`/images/buildStages/${arr.join(" + ")}.png`);

    if (
      arr.some((t) => t.includes("Motherboard") && !t.startsWith("Motherboard"))
    ) {
      const mbGeneric = arr.map((t) =>
        t.endsWith("Motherboard") ? "Motherboard" : t
      );
      candidates.add(`/images/buildStages/${mbGeneric.join(" + ")}.png`);
    }

    const allGeneric = arr.map((t) => t.replace(/^(ATX |mATX )/, ""));
    candidates.add(`/images/buildStages/${allGeneric.join(" + ")}.png`);
  };

  pushVariants(partsExact);

  const haveMB = !!build.motherboard?.length;
  const haveCPU = !!build.processor?.length;
  const haveLater =
    !!build.ram?.length ||
    !!build.storage?.length ||
    !!build.gpu?.length ||
    !!build.cooler?.length ||
    !!build.psu?.length;

  if (haveMB && !haveCPU && haveLater) {
    const withCpu = [...partsExact];
    const idxMb = withCpu.findIndex((t) => t.endsWith("Motherboard"));
    const insertAt = idxMb >= 0 ? idxMb + 1 : 1;
    withCpu.splice(insertAt, 0, "CPU");
    pushVariants(withCpu);
  }

  if (build.ram?.length) {
    const rCount = build.ram.length;
    const ramLabel = rCount >= 2 ? "2 RAM" : "1 RAM";
    const alt = partsExact.map((p) => (p === "RAM" ? ramLabel : p));
    pushVariants(alt);

    if (haveMB && !haveCPU && haveLater) {
      const withCpuAlt = [...alt];
      const idxMb = withCpuAlt.findIndex((t) => t.endsWith("Motherboard"));
      const insertAt = idxMb >= 0 ? idxMb + 1 : 1;
      withCpuAlt.splice(insertAt, 0, "CPU");
      pushVariants(withCpuAlt);
    }
  }

  candidates.add("/images/buildStages/Case Only.png");
  candidates.add(`/images/buildStages/${caseLabel}.png`);
  candidates.add("/images/buildStages/Case.png");

  const list = Array.from(candidates);
  return list;
}


type CompatibilityIssue = {
  type: "error" | "warning" | "info";
  message: string;
  affectedComponents: string[];
  level?: "low" | "medium" | "high";
};

type DragItem = Part & { category: string };

// ---------------- COMPONENT DATA ----------------

const COMPONENT_ORDER: Array<keyof BuildState> = [
  "case",
  "motherboard",
  "processor",
  "ram",
  "storage",
  "gpu",
  "cooler",
  "psu",
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const tooltipMap: Record<string, string> = {
  case: "Holds all components together and ensures airflow.",
  motherboard: "Connects all components and distributes power.",
  processor: "Brain of your PC that handles calculations.",
  gpu: "Handles rendering for games and graphic tasks.",
  ram: "Temporary memory used for fast data access.",
  storage: "Stores your OS, games, and files.",
  psu: "Powers all components in your system.",
  cooler: "Keeps your CPU from overheating.",
};

// ---------------- Compatibility helpers (stateless) --------------
const categoryAlias: Record<string, string> = {
  cpu: "processor",
  mb: "motherboard",
  motherboard: "motherboard",
  processor: "processor",
  ram: "ram",
  gpu: "gpu",
  psu: "psu",
  case: "case",
  cooler: "cooler",
  storage: "storage",
};

// ---------------- UI helpers ----------------
const CompatibilityPanel: React.FC<{ issues: CompatibilityIssue[] }> = ({
  issues,
}) => {
  if (issues.length === 0) {
    return (
      <div className="mb-4 p-3 bg-green-600 dark:bg-green-900 border border-green-400 rounded">
        <div className="text-green-300 font-semibold">✅ All Compatible!</div>
        <div className="text-green-200 text-sm">
          No compatibility issues detected.
        </div>
      </div>
    );
  }
  return (
    <div className="mb-4 space-y-2">
      {issues.map((issue, idx) => (
        <div
          key={idx}
          className={`p-3 rounded border ${
            issue.type === "error"
              ? "bg-red-500 dark:bg-red-900 border-red-400 text-red-200 dark:text-red-300"
              : issue.type === "warning"
              ? "bg-yellow-500 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-400 text-yellow-200 dark:text-yellow-300"
              : "bg-blue-900 border-blue-400 text-blue-300"
          }`}
        >
          <div className="font-semibold">
            {issue.type === "error"
              ? "❌ Incompatible"
              : issue.type === "warning"
              ? "⚠️ Warning"
              : "ℹ️ Info"}
          </div>
          <div className="text-sm">{issue.message}</div>
        </div>
      ))}
    </div>
  );
};

// --- json-rules-engine EventEmitter hardening (prevents 'error' crash) ---
import type { Engine } from "json-rules-engine";

const _patchedEngines = new WeakSet<Engine>();
function ensureEngineSafe(engine: Engine) {
  if (_patchedEngines.has(engine)) return;
  // Attach a no-op listener so EventEmitter doesn't throw on 'error' events
  engine.on("error", (_evt) => {
    // Optional: console.debug("Rules event(type=error) swallowed:", evt);
  });
  _patchedEngines.add(engine);
}

async function checkCompatibility(
  engine: Engine | null,
  build: BuildState
): Promise<CompatibilityIssue[]> {
  if (!engine) return [];

  // 🔧 ensure engine won't crash on an emitted "error" event
  ensureEngineSafe(engine);

  const case_ = build.case?.[0];
  const mb = build.motherboard?.[0];
  const cpu = build.processor?.[0];
  const ram = build.ram?.[0];
  const gpu = build.gpu?.[0];
  const psu = build.psu?.[0];
  const cooler = build.cooler?.[0];

  const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);
  const ffRank = (ff?: string) => {
    const s = ff?.toLowerCase().replace(/\s/g, "") || "unknown";
    if (s === "atx") return 3;
    if (s === "matx" || s === "microatx") return 2;
    if (s === "mitx" || s === "itx" || s === "miniitx") return 1;
    return 0;
  };
  const normDDR = (d?: string) => (d ? String(d).toUpperCase() : "unknown");
  const normSocket = (s?: string) =>
    s ? String(s).toUpperCase().replace(/\s+/g, "") : "UNKNOWN";
  const coolerSocketList = (p?: Part) => {
    const single = p?.specs?.socket;
    const list = p?.specs?.supported_sockets as string[] | undefined;
    if (Array.isArray(list) && list.length) return list.map(normSocket);
    if (single) return [normSocket(single)];
    return [];
  };

  const cpuSocketStr = normSocket(cpu?.specs?.socket);
  const mbSocketStr = normSocket(mb?.specs?.socket);
  const coolerList = coolerSocketList(cooler);

  // Default to true until we actually have both sides; avoids false negatives on empty builds
  const coolerSupportsCpu =
    cpuSocketStr !== "UNKNOWN" && coolerList.length > 0
      ? coolerList.includes(cpuSocketStr)
      : true;

  const facts = {
    caseFormFactorRank: ffRank(case_?.specs?.form_factor),
    mbFormFactorRank: ffRank(mb?.specs?.form_factor),
    cpuDDR: normDDR(cpu?.specs?.ddr),
    mbDDR: normDDR(mb?.specs?.ddr),
    ramSpeed: toNum(ram?.specs?.ddr_speed),
    mbMaxRamSpeed: toNum(
      (mb?.specs as any)?.max_ddr_speed ?? mb?.specs?.ddr_speed
    ),
    cpuMaxRamSpeed: toNum(
      (cpu?.specs as any)?.max_ddr_speed ?? cpu?.specs?.ddr_speed
    ),
    psuWattage: toNum(psu?.specs?.wattage),
    gpuRequiredWattage: toNum(gpu?.specs?.required_psu),
    gpuRequiredWattagePlus100: toNum(gpu?.specs?.required_psu) + 100,
    cpuSocket: cpuSocketStr,
    mbSocket: mbSocketStr,
    coolerSockets: coolerList,
    coolerSupportsCpu,
    cpuTdp: toNum(cpu?.specs?.tdp),
    coolerTdp: toNum(cooler?.specs?.cooler_tdp),
  };

  try {
    const { events } = await engine.run(facts);

    return events.map((e: any) => {
      // 🔧 Normalize reserved 'error' to domain-friendly type your UI expects
      const normalizedType =
        e.type === "error" ? "incompatible" : e.type ?? "info";

      // Keep your original UI mapping: incompatible -> shown like an error
      const uiType: "error" | "warning" | "info" =
        normalizedType === "incompatible"
          ? "error"
          : normalizedType === "warning"
          ? "warning"
          : "info";

      return {
        type: uiType,
        message: e.params?.message || "Unknown issue",
        affectedComponents: e.params?.affectedComponents || [],
      };
    });
  } catch (err) {
    console.error("❌ Engine run failed:", err, "with facts:", facts);
    return [];
  }
}

// ---------------- MAIN PAGE ----------------
export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const isMobile = useIsMobile();

  const [build, setBuild] = useState<BuildState>(
    COMPONENT_ORDER.reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {} as BuildState
    )
  );
  const { engineRef, ready: rulesReady } = useServerRules();
  const [loadedBuildName, setLoadedBuildName] = useState("");

  // states for each category
  const [cases, setCases] = useState<Part[]>([]);
  const [motherboards, setMotherboards] = useState<Part[]>([]);
  const [processors, setProcessors] = useState<Part[]>([]);
  const [gpus, setGpus] = useState<Part[]>([]);
  const [rams, setRams] = useState<Part[]>([]);
  const [storages, setStorages] = useState<Part[]>([]);
  const [psus, setPsus] = useState<Part[]>([]);
  const [coolers, setCoolers] = useState<Part[]>([]);

  const { id } = useParams(); // build ID
  const token = localStorage.getItem("token"); // or however you store it
  const [showSummary, setShowSummary] = useState(false);
  const [message, setMessage] = useState("");

  const currentCategory = COMPONENT_ORDER[step];
  const [compatibilityIssues, setCompatibilityIssues] = useState<
    CompatibilityIssue[]
  >([]);

  // De-dupe by (type + message + affectedComponents)
  function uniqueIssues(list: CompatibilityIssue[]): CompatibilityIssue[] {
    const keyOf = (i: CompatibilityIssue) =>
      `${i.type}|${i.message}|${[...i.affectedComponents].sort().join(",")}`;
    const map = new Map<string, CompatibilityIssue>();
    for (const i of list) map.set(keyOf(i), i);
    return [...map.values()];
  }
  // 🔹 NEW: Run backend check whenever build changes
  async function runAllCompatibilityChecks(
    build: BuildState
  ): Promise<CompatibilityIssue[]> {
    const backendIssues = await fetchCompatibility(build);
    const engineIssues =
      rulesReady && engineRef.current
        ? await checkCompatibility(engineRef.current, build)
        : [];
    const instantIssues: CompatibilityIssue[] = [];

    return uniqueIssues([...backendIssues, ...engineIssues, ...instantIssues]);
  }

  // effect to run whenever build changes
  useEffect(() => {
    const runChecks = async () => {
      if (Object.values(build).some((parts) => parts.length > 0)) {
        const allIssues = await runAllCompatibilityChecks(build);
        setCompatibilityIssues(allIssues);
      } else {
        setCompatibilityIssues([]);
      }
    };
    runChecks();
  }, [build]);

  useEffect(() => {
    const fetchParts = async (
      category: string,
      setter: React.Dispatch<React.SetStateAction<Part[]>>
    ) => {
      try {
        const res = await API.get(`/parts?category=${category}`);
        const data = res.data;
        const mapped = data.map((item: any) => {
          const token =
            item.specs?.form_factor &&
            typeof item.specs.form_factor === "string"
              ? item.specs.form_factor.toLowerCase().replace(/[^a-z0-9]/g, "")
              : null;

          return {
            _id: item._id,
            name: `${item.name}${token ? ` (${item.specs.form_factor})` : ""}`,
            specs: item.specs || {},
          } as Part;
        });

        setter(mapped);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      }
    };

    // ✅ Clear all lists when switching category
    setCases([]);
    setMotherboards([]);
    setProcessors([]);
    setGpus([]);
    setRams([]);
    setStorages([]);
    setPsus([]);
    setCoolers([]);

    // ✅ Fetch only the current category
    switch (currentCategory) {
      case "case":
        fetchParts("case", setCases);
        break;
      case "motherboard":
        fetchParts("motherboard", setMotherboards);
        break;
      case "processor":
        fetchParts("processor", setProcessors);
        break;
      case "gpu":
        fetchParts("gpu", setGpus);
        break;
      case "ram":
        fetchParts("ram", setRams);
        break;
      case "storage":
        fetchParts("storage", setStorages);
        break;
      case "psu":
        fetchParts("psu", setPsus);
        break;
      case "cooler":
        fetchParts("cooler", setCoolers);
        break;
    }
  }, [currentCategory]);

  const getPartsForCategory = (category: string): Part[] => {
    switch (category) {
      case "case":
        return cases;
      case "motherboard":
        return motherboards;
      case "processor":
        return processors;
      case "gpu":
        return gpus;
      case "ram":
        return rams;
      case "storage":
        return storages;
      case "psu":
        return psus;
      case "cooler":
        return coolers;
      default:
        return [];
    }
  };

  // Helper to get part name by id (searches both fetched and hardcoded)
  const getPartName = (partId: string, category: string): string => {
    const list = getPartsForCategory(category);
    const found = list.find((p) => p._id === partId);
    return found ? found.name : "";
  };

  // main function to get backend issues
  async function fetchCompatibility(
    build: BuildState
  ): Promise<CompatibilityIssue[]> {
    try {
      const res = await API.post("/compatibility", { build });

      return res.data.issues || [];
    } catch (err) {
      console.error("❌ Compatibility check failed", err);
      return [];
    }
  }

  useEffect(() => {
    const fetchBuild = async () => {
      if (!id) return;
      try {
        const res = await API.get(`/savedbuilds/${id}`);

        const data = res.data;

        setLoadedBuildName(data.name || "");

        const prefilled: BuildState = COMPONENT_ORDER.reduce(
          (acc, category) => {
            acc[category] = [];
            return acc;
          },
          {} as BuildState
        );

        const fetchPromises: Promise<void>[] = [];

        for (const category of COMPONENT_ORDER) {
          const saved = data.parts?.[category];

          if (saved && typeof saved === "object" && !Array.isArray(saved)) {
            const part: Part = saved;
            const name = part.name
              ? `${part.name}${
                  part.specs?.form_factor ? ` (${part.specs.form_factor})` : ""
                }`
              : part._id || "";
            prefilled[category] = [
              {
                _id: part._id || "",
                name,
                specs: part.specs || {},
              },
            ];
            continue;
          }

          // Case B & C: Part is a string ID that needs to be fetched
          const partId = Array.isArray(saved) ? saved[0] : saved;
          if (typeof partId === "string" && partId.trim().length > 0) {
            // Use a self-executing async function for the promise
            const promise = (async () => {
              try {
                // ✅ 3. Replaced the other fetch calls with API.get()
                const partRes = await API.get(
                  `/parts/${encodeURIComponent(partId)}`
                );
                const item: Part = partRes.data; // Data is in .data
                const name = item.name
                  ? `${item.name}${
                      item.specs?.form_factor
                        ? ` (${item.specs.form_factor})`
                        : ""
                    }`
                  : partId;
                prefilled[category] = [
                  { _id: item._id || partId, name, specs: item.specs },
                ];
              } catch (err) {
                console.warn("Could not fetch part", partId, err);
                prefilled[category] = [{ _id: partId, name: "Not Found" }];
              }
            })();
            fetchPromises.push(promise);
          }
        }

        if (fetchPromises.length) await Promise.all(fetchPromises);

        setBuild(prefilled);
      } catch (err) {
        console.error("Failed to load build:", err);
      }
    };

    fetchBuild();
  }, [id, token]);

  // Get compatibility status for the preview icons/colors
  const getCompatibilityStatus = async (
    partId: string,
    category: string,
    b: BuildState
  ): Promise<"compatible" | "warning" | "incompatible"> => {
    const list = getPartsForCategory(category);
    const found = list.find((p) => p._id === partId);

    const tempBuild: BuildState = {
      ...b,
      [category]: [
        {
          _id: partId,
          name: found ? found.name : getPartName(partId, category) || "",
          specs: found ? found.specs : {},
        },
      ],
    };

    const issues = await runAllCompatibilityChecks(tempBuild);

    // 🔹 Normalize categories before comparing
    const normalizedCategory = categoryAlias[category] || category;

    const relevant = issues.filter((i) =>
      i.affectedComponents.some(
        (comp) =>
          comp === normalizedCategory ||
          categoryAlias[comp] === normalizedCategory
      )
    );

    if (relevant.some((i) => i.type === "error")) return "incompatible";
    if (relevant.some((i) => i.type === "warning")) return "warning";
    return "compatible";
  };

  // ---------------- DRAGGABLE ----------------
  const DraggablePart: React.FC<{
    part: Part;
    category: string;
    build: BuildState;
    onTapAdd?: (item: DragItem) => void;
    isMobile?: boolean;
  }> = ({ part, category, build, onTapAdd, isMobile = false }) => {
    const [compatibility, setCompatibility] = useState<
      "compatible" | "warning" | "incompatible"
    >("compatible");

    useEffect(() => {
      const runCheck = async () => {
        const result = await getCompatibilityStatus(part._id, category, build);
        setCompatibility(result);
      };
      runCheck();
    }, [part._id, category, build]);

    const getColor = () =>
      compatibility === "compatible"
        ? "bg-lightbgfill dark:bg-gray-800 border-l-neonblue"
        : compatibility === "warning"
        ? "bg-yellow-200 dark:bg-yellow-900 border-l-yellow-400"
        : "bg-red-200 dark:bg-red-900 border-l-red-400";

    const getIcon = () =>
      compatibility === "compatible"
        ? "✅"
        : compatibility === "warning"
        ? "⚠️"
        : "❌";

    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: "PART",
      item: { ...part, category },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      canDrag: !isMobile, // Only allow drag on desktop
    });

    if (!isMobile) drag(ref);

    return (
      <div
        ref={ref}
        title={tooltipMap[category]}
        onClick={() => isMobile && onTapAdd && onTapAdd({ ...part, category })}
        className={`p-2 mb-2 border-l-4 border rounded ${
          isMobile ? "cursor-pointer" : "cursor-grab"
        } text-neonblue dark:text-white text-sm opacity-${
          isDragging ? "40" : "100"
        } ${getColor()}`}
      >
        <span className="mr-2">{getIcon()}</span>
        {part.name}
      </div>
    );
  };

  const candidates = getBuildStageImages(build);
  const [imgSrc, setImgSrc] = useState<string | null>(candidates[0] ?? null);

  // ---------------- DROP SLOT ----------------
  const DropSlot: React.FC<{
    category: string;
    part: Part[];
    build: BuildState;
    onDropPart: (item: DragItem) => void;
    isRendering: boolean;
  }> = ({ category, part, build, onDropPart, isRendering }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isOver }, drop] = useDrop({
      accept: "PART",
      drop: (item: DragItem) => onDropPart(item),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    });
    
    // whenever candidates change (user adds parts), reset to the first option
 useEffect(() => {
  setImgSrc(candidates[0] ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [JSON.stringify(candidates)]);

const allComponents = Object.values(build)
  .flat()
  .map((c) => c.name)
  .join(" + ");
drop(ref);

// --- DYNAMIC MISSING PART LOGIC ---
let missingPart: keyof BuildState | null = null;
// Find the last (furthest) chosen part in order
let lastChosenIndex = -1;
for (let i = COMPONENT_ORDER.length - 1; i >= 0; i--) {
  const part = COMPONENT_ORDER[i];
  if (Array.isArray(build[part]) && build[part].length > 0) {
    lastChosenIndex = i;
    break;
  }
}
// Among those up to that last, find the first missing part
if (lastChosenIndex >= 0) {
  for (let i = 0; i < lastChosenIndex; i++) {
    const part = COMPONENT_ORDER[i];
    if (!build[part] || build[part].length === 0) {
      missingPart = part;
      break;
    }
  }
}
// --- END MISSING PART LOGIC ---

return (
  <div
    ref={ref}
    className={`w-full min-h-[300px] md:h-[500px] border-dashed border-2 p-2 md:p-4 flex flex-col justify-center items-center text-center text-sm ${
      isOver ? "border-blue-400" : "border-white"
    }`}
  >
    <div className="w-full h-full rounded-xl mb-2 md:mb-4 flex items-center justify-center border border-neonblue/40 bg-black/20 overflow-hidden">
      {missingPart ? (
        <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
          Insert {missingPart.charAt(0).toUpperCase() + missingPart.slice(1)} to render image
        </div>
      ) : imgSrc ? (
        <img
          key={imgSrc}
          src={imgSrc}
          alt="Build stage"
          className="object-contain w-full h-full max-w-full max-h-[250px] md:max-h-[480px] transition-transform duration-300 ease-out hover:scale-105"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
          [Image Placeholder]
        </div>
      )}
    </div>

    <p className="text-green-400 mb-2">
      {isRendering ? "Rendering..." : allComponents || "No components yet"}
    </p>

    {part.length > 0 ? (
      <>
        <span className="text-white text-sm font-bold mb-1">
          ✅ You added: {part[0].name}
        </span>
        <span className="text-xs text-gray-400 italic">
          Only one {category} can be added.
        </span>
      </>
    ) : (
      <span className="italic text-gray-400">
        {typeof window !== "undefined" && window.innerWidth < 768
          ? `Tap a ${category} above to add`
          : `< Drop your ${category} here >`}
      </span>
    )}

    {tooltipMap[category] && (
      <div className="mt-2 text-xs text-yellow-400 italic">
        💡 {tooltipMap[category]}
      </div>
    )}
  </div>
);
  };
  // ---------------- SUMMARY PAGE ----------------
  const SummaryPage: React.FC<{
    build: BuildState;
    issues: CompatibilityIssue[];
    onBack: () => void;
    loadedBuildName: string;
  }> = ({ build, issues, onBack, loadedBuildName }) => {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [buildName, setBuildName] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSaveBuild = async () => {
      if (!buildName.trim()) {
        toast.error("Please enter a name for your build.");
        return;
      }
      try {
        // First, prepare the data payload that will be sent
        const payload = {
          name: buildName,
          parts: Object.fromEntries(
            Object.entries(build).map(([category, parts]) => [
              category,
              parts.map((p) => p._id),
            ])
          ),
        };

        if (id) {
          await API.put(`/savedbuilds/${id}`, payload);
        } else {
          // This is a new build, so we create it
          await API.post("/savedbuilds", payload);
        }

        toast.success("✅ Build saved successfully!");
        setIsSaveModalOpen(false);
        navigate("/account-settings");
      } catch (err) {
        console.error("Error saving build:", err);
        toast.error("❌ Could not save build");
      }
    };
    return (
      <>
        <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-lightbgfill dark:bg-darkbg border-neonblue/20">
            <DialogHeader>
              <DialogTitle className="text-neonblue">
                Save Your Build
              </DialogTitle>
              <DialogDescription>
                Give your new PC build a unique name. You can change it later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="e.g., Ultimate Gaming Rig"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSaveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveBuild} disabled={!buildName.trim()}>
                Save Build
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="min-h-screen bg-lightbgfill dark:bg-darkbg text-white px-8 py-6 rounded-2xl border">
          <h1 className="text-2xl font-bold text-neonblue mb-4">
            📋 Build Summary
          </h1>

          {/* Build List */}
          {Object.entries(build).map(([category, parts]) => (
            <div
              key={category}
              className="mb-3 p-3 border border-neonblue rounded bg-neonblue/50 dark:bg-darkbg"
            >
              <h2 className="text-neonblue dark:text-neonblue text-lg font-semibold mb-2">
                {category.toUpperCase()}
              </h2>
              {parts.length > 0 ? (
                <p className="dark:text-green-400">✅ {parts[0].name}</p>
              ) : (
                <p className="text-gray-500 italic">Not Selected</p>
              )}
            </div>
          ))}

          {/* Compatibility Issues Recap */}
          <div className="mt-6">
            <h3 className="text-yellow-400 font-bold mb-2">
              ⚠️ Compatibility Check
            </h3>
            {issues.length === 0 ? (
              <p className="text-green-400">✅ No issues detected.</p>
            ) : (
              <ul className="space-y-2">
                {issues.map((issue, idx) => (
                  <li
                    key={idx}
                    className={`p-2 rounded border ${
                      issue.type === "error"
                        ? "bg-red-900 border-red-400 text-red-300"
                        : issue.type === "warning"
                        ? "bg-yellow-500 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-400 text-yellow-200 dark:text-yellow-300"
                        : "bg-blue-900 border-blue-400 text-blue-300"
                    }`}
                  >
                    {/* "bg-yellow-500 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-400 text-yellow-200 dark:text-yellow-300" */}
                    <strong>
                      {issue.type === "error"
                        ? "❌ Incompatible"
                        : issue.type === "warning"
                        ? "⚠️ Warning"
                        : "ℹ️ Info"}
                    </strong>
                    : {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Extra Info */}
          <div className="mt-6 p-4 bg-neonblue/90 dark:bg-gray-800 rounded border border-neonblue dark:border-gray-600">
            <h3 className="text-yellow-400 font-bold mb-2">ℹ️ Extra Info</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>
                Total components selected:{" "}
                {Object.values(build).filter((p) => p.length > 0).length}
              </li>
              <li>Date: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onBack}>
              ◀ Back to Build
            </Button>
            <Button
              onClick={() => {
                const hasParts = Object.values(build).some(
                  (parts) => parts.length > 0
                );
                if (!hasParts) {
                  toast.error(
                    "❌ You must add at least one component before saving."
                  );
                  return;
                }

                setBuildName(id ? loadedBuildName : "");
                setIsSaveModalOpen(true);
              }}
            >
              💾 {id ? "Update Build" : "Save Build"}{" "}
              {/* Optional: change button text */}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/guides")}>
              📘 Guides
            </Button>
          </div>
        </div>
      </>
    );
  };

  // ---------------- Drop handler ----------------
  const onDropPart = (item: DragItem) => {
    if (build[item.category].length > 0) return;
    setIsRendering(true);

    setTimeout(async () => {
      // 1) Update build with the dropped part
      const updatedBuild: BuildState = {
        ...build,
        [item.category]: [
          { _id: item._id, name: item.name, specs: item.specs || {} },
        ],
      };
      setBuild(updatedBuild);

      // 2) Run ALL checks (backend + local engine + quick)
      const allIssues = await runAllCompatibilityChecks(updatedBuild);
      setCompatibilityIssues(allIssues);

      // 3) Inline success message (auto-clear)
      setMessage(`✅ Added ${item.name} to ${capitalize(item.category)}`);
      setTimeout(() => setMessage(""), 2000);

      setIsRendering(false);

      // 4) Auto-advance to next step
      if (step < COMPONENT_ORDER.length - 1) {
        setTimeout(() => setStep((prev) => prev + 1), 500);
      }
    }, 500);
  };

  // render
  if (showSummary) {
    return (
      <SummaryPage
        build={build}
        issues={compatibilityIssues}
        onBack={() => setShowSummary(false)}
        loadedBuildName={loadedBuildName}
      />
    );
  }

  // Determine parts to show in the left sidebar for current category
  const partsToRender = getPartsForCategory(currentCategory);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-lightbg dark:bg-darkbg text-white px-8 py-6 font-mono rounded-2xl border">
        <div className="text-neonblue text-2xl font-bold mb-4">Pixel Build</div>

        <div className="mb-4 text-sm text-gray-400">
          Step {step + 1} of {COMPONENT_ORDER.length} – Add{" "}
          {capitalize(currentCategory)}
        </div>

        <CompatibilityPanel issues={compatibilityIssues} />

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/5 border-2 border-neonblue p-2 md:p-4 rounded mb-2 md:mb-0">
            <h2 className="text-neonblue text-md font-semibold mb-2">
              {currentCategory.toUpperCase()}
            </h2>
            <div className="mb-3 text-xs text-gray-400 dark:text-gray-300">
              <div>✅ Compatible</div>
              <div>⚠️ Warning</div>
              <div>❌ Incompatible</div>
            </div>
            <div className="space-y-2">
              {partsToRender.length === 0 ? (
                <div className="text-gray-500 italic text-sm">Loading...</div>
              ) : (
                partsToRender.map((part, index) => (
                  <DraggablePart
                    key={part._id || index}
                    part={part}
                    category={currentCategory}
                    build={build}
                    onTapAdd={onDropPart}
                    isMobile={isMobile}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-between mt-4 gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="px-2 md:px-3 py-1 text-xs md:text-sm rounded border border-neonblue text-neonblue bg-lightbgfill/50 hover:bg-neonblue/60 hover:text-white dark:hover:bg-gray-800 dark:bg-darkbg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ◀ Prev
              </button>
              <span className="text-xs text-gray-400">
                {step + 1} / {COMPONENT_ORDER.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setStep((s) => Math.min(COMPONENT_ORDER.length - 1, s + 1))
                }
                disabled={step === COMPONENT_ORDER.length - 1}
                className="px-3 py-1 rounded border bg-lightbgfill/50 border-neonblue text-neonblue hover:text-white hover:bg-neonblue/60 dark:hover:bg-gray-800 dark:bg-darkbg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* Drop Area */}
          <div className="w-full md:w-3/5 border border-neonblue p-2 md:p-4 rounded space-y-4">
            <DropSlot
              category={currentCategory}
              part={build[currentCategory]}
              build={build}
              onDropPart={onDropPart}
              isRendering={isRendering}
            />

            <div className="flex gap-3 mt-4 justify-center">
              <button
                onClick={() => {
                  const hasParts = Object.values(build).some(
                    (parts) => parts.length > 0
                  );
                  if (!hasParts) {
                    alert(
                      "❌ You must add at least one component before finishing."
                    );
                    return;
                  }
                  setShowSummary(true);
                }}
                className="px-6 py-2 rounded border-2 bg-lightbgfill dark:bg-darkbg border-neonblue text-neonblue hover:neonblue-900"
              >
                ✅ Finish Build
              </button>
            </div>
            {message && (
              <div className="mt-2 text-green-400 text-sm">{message}</div>
            )}
          </div>

          {/* Mini Summary Sidebar */}
          <div className="w-full md:w-1/5 border-2 dark:text-white text-neonblue border-neonblue p-2 md:p-4 rounded text-center mt-2 md:mt-0">
            <h2 className="font-bold mb-2">Your Build</h2>
            <div className="space-y-2 text-left">
              {COMPONENT_ORDER.map((key) => {
                const part = build[key][0];

                return (
                  <div
                    key={key}
                    className={`p-2 border-l-4 border rounded text-sm ${
                      part
                        ? "bg-lightbgfill dark:bg-gray-800 border-l-neonblue text-neonblue dark:text-white"
                        : "bg-gray-700/30 border-l-gray-500 text-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="mr-1">{part ? "✅" : "⚫"}</span>
                        <div>
                          <div className="font-medium text-xs">
                            {capitalize(key).toUpperCase()}
                          </div>
                          <div className="text-xs">
                            {part ? part.name : "None"}
                          </div>
                        </div>
                      </div>
                      {/* Remove button - only show if part exists */}
                      {part && (
                        <button
                          onClick={() => {
                            setBuild((prev) => ({
                              ...prev,
                              [key]: [],
                            }));
                          }}
                          className="text-red-400 hover:text-red-600 p-1 rounded"
                          title="Remove component"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6m0 12L6 6"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
