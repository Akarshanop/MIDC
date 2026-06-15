import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { districtCoords, investors, fmtCr } from "@/lib/midc-data";

export type MapPoint = { district: string; value: number };

// District -> approximate real lat/lng (Maharashtra)
const districtLatLng: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777], Pune: [18.5204, 73.8567], Nashik: [19.9975, 73.7898],
  Aurangabad: [19.8762, 75.3433], Nagpur: [21.1458, 79.0882], Raigad: [18.5158, 73.1822],
  Thane: [19.2183, 72.9781], Satara: [17.6805, 74.0183], Solapur: [17.6599, 75.9064],
  Kolhapur: [16.705, 74.2433], Jalgaon: [21.0077, 75.5626], Latur: [18.4088, 76.5604],
  Nanded: [19.1383, 77.321], Amravati: [20.9374, 77.7796], Akola: [20.7059, 77.0219],
  Chandrapur: [19.9615, 79.2961], Sangli: [16.8524, 74.5815], Ahmednagar: [19.0948, 74.748],
  Wardha: [20.7453, 78.6022], Yavatmal: [20.3888, 78.1204], Beed: [18.989, 75.7601],
  Osmanabad: [18.186, 76.0419], Parbhani: [19.2608, 76.7734], Hingoli: [19.7172, 77.1497],
  Buldhana: [20.5292, 76.1842], Washim: [20.111, 77.1334], Gondia: [21.4624, 80.1962],
  Gadchiroli: [20.1809, 80.0089], Bhandara: [21.1704, 79.6536], Sindhudurg: [16.3479, 73.5664],
  Ratnagiri: [16.9902, 73.312], Dhule: [20.9042, 74.7749], Nandurbar: [21.3753, 74.2403],
  Palghar: [19.6967, 72.7693],
};

export function LeafletMap({
  points,
  height = 380,
  onSelectDistrict,
}: {
  points: MapPoint[];
  height?: number;
  onSelectDistrict?: (district: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const onSelectDistrictRef = useRef(onSelectDistrict);

  useEffect(() => {
    onSelectDistrictRef.current = onSelectDistrict;
  }, [onSelectDistrict]);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    if (!ref.current) return;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      const map = L.map(ref.current, { zoomControl: true, scrollWheelZoom: true }).setView(
        [19.3, 76.5],
        6.3,
      );
      mapRef.current = map;
      requestAnimationFrame(() => map.invalidateSize());
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const maxVal = Math.max(1, ...points.map((p) => p.value));
      points.forEach((p) => {
        const ll = districtLatLng[p.district] ||
          (districtCoords[p.district] ? [19.3, 76.5] : null);
        if (!ll) return;
        const radius = 8 + Math.round((p.value / maxVal) * 22);
        const districtInvestors = investors.filter((i) => i.District === p.district);
        const totalCr = districtInvestors.reduce(
          (s, i) => s + (i.Proposed_Investment_Cr || 0),
          0,
        );
        const marker = L.circleMarker(ll as any, {
          radius,
          color: "#ff7a18",
          weight: 2,
          fillColor: "#ff9a3c",
          fillOpacity: 0.55,
        }).addTo(map);
        const popup = `
          <div style="font-family:Inter,sans-serif;min-width:200px">
            <div style="font-weight:700;font-size:13px;color:#0b1f4a">${p.district}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:2px">${p.value} investor interest signal${p.value === 1 ? "" : "s"}</div>
            <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
              <div><div style="color:#9ca3af">Investors</div><div style="font-weight:600">${districtInvestors.length}</div></div>
              <div><div style="color:#9ca3af">Pipeline</div><div style="font-weight:600">${fmtCr(totalCr)}</div></div>
            </div>
            <button id="midc-d-${p.district}" style="margin-top:8px;width:100%;background:linear-gradient(90deg,#ff7a18,#ff9a3c);color:white;border:none;border-radius:6px;padding:6px;font-size:11px;font-weight:600;cursor:pointer">Open District Brief →</button>
          </div>`;
        marker.bindPopup(popup);
        marker.on("popupopen", () => {
          const btn = document.getElementById(`midc-d-${p.district}`);
          if (btn) btn.onclick = () => onSelectDistrictRef.current?.(p.district);
        });
        marker.on("click", () => marker.openPopup());
      });

      // Restrict pan
      map.setMaxBounds(L.latLngBounds([14.5, 71.5], [22.5, 81.5]));

      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => map.invalidateSize());
      });
      if (!ref.current) return;
      resizeObserver.observe(ref.current);
    })();
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className="midc-leaflet-shell border border-border"
    />
  );
}
