import {
  Camera,
  CheckCircle2,
  Loader2,
  LocateFixed,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEmployeesQuery } from "../services/api";
type Rules = {
  geoFenceEnabled?: boolean;
  web?: {
    locationEnabled?: boolean;
    locationMandatory?: boolean;
    cameraEnabled?: boolean;
    cameraMandatory?: boolean;
    liveSelfieMandatory?: boolean;
  };
};
const auth = () => ({
  authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token") || ""}`,
});
export function VerifiedCheckIn() {
  const { data: employees } = useEmployeesQuery();
  const [employeeId, setEmployeeId] = useState(""),
    [rules, setRules] = useState<Rules>({}),
    [location, setLocation] = useState<GeolocationCoordinates>(),
    [stream, setStream] = useState<MediaStream>(),
    [image, setImage] = useState<Blob>(),
    [preview, setPreview] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    void fetch("/api/v1/attendance/rules/current", { headers: auth() })
      .then((r) => r.json())
      .then((x) => setRules(x.data || {}));
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);
  const locationRequired = Boolean(
      rules.geoFenceEnabled ||
        rules.web?.locationEnabled ||
        rules.web?.locationMandatory,
    ),
    cameraRequired = Boolean(
      rules.web?.cameraEnabled ||
        rules.web?.cameraMandatory ||
        rules.web?.liveSelfieMandatory,
    );
  const getLocation = () =>
    new Promise<GeolocationCoordinates>((resolve, reject) => {
      if (!window.isSecureContext && window.location.hostname !== "localhost")
        return reject(new Error("Location check-in requires HTTPS."));
      if (!navigator.geolocation)
        return reject(new Error("Location is not supported by this browser."));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          resolve(position.coords);
        },
        () =>
          reject(
            new Error("Location permission was denied or GPS is unavailable."),
          ),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    });
  const openCamera = async () => {
    if (!window.isSecureContext && window.location.hostname !== "localhost")
      throw new Error("Camera check-in requires HTTPS.");
    if (!navigator.mediaDevices?.getUserMedia)
      throw new Error("No compatible webcam was found.");
    const media = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    setStream(media);
    setTimeout(() => {
      if (video.current) video.current.srcObject = media;
    }, 0);
  };
  const capture = () => {
    const source = video.current;
    if (!source?.videoWidth) return setMessage("Camera is not ready yet.");
    const canvas = document.createElement("canvas");
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
    canvas.getContext("2d")?.drawImage(source, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setImage(blob);
          setPreview(URL.createObjectURL(blob));
          stream?.getTracks().forEach((track) => track.stop());
          setStream(undefined);
        }
      },
      "image/jpeg",
      0.82,
    );
  };
  const start = async () => {
    setMessage("");
    try {
      if (locationRequired && !location) await getLocation();
      if (cameraRequired && !image && !stream) await openCamera();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Verification could not start.",
      );
    }
  };
  const submit = async () => {
    if (!employeeId) return setMessage("Select an employee.");
    setBusy(true);
    setMessage("");
    try {
      const coords = locationRequired
        ? location || (await getLocation())
        : undefined;
      if (cameraRequired && !image)
        throw new Error("Capture and confirm a live selfie first.");
      const method =
        locationRequired && cameraRequired
          ? "LOCATION_CAMERA"
          : cameraRequired
            ? "CAMERA"
            : locationRequired
              ? "LOCATION"
              : "STANDARD";
      const form = new FormData();
      form.append(
        "data",
        JSON.stringify({
          employeeId,
          source: "WEB",
          checkInMethod: method,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          accuracy: coords?.accuracy,
          deviceType: "DESKTOP",
          platform: navigator.platform,
          browser: navigator.userAgent,
          deviceDetails: navigator.userAgent,
        }),
      );
      if (image) form.append("selfie", image, `check-in-${Date.now()}.jpg`);
      const response = await fetch("/api/v1/attendance/check-in", {
        method: "POST",
        headers: auth(),
        body: form,
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Check-in failed.");
      window.dispatchEvent(
        new CustomEvent("employeehub:attendance", { detail: json.data }),
      );
      setMessage("Check-in verified successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Check-in failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-400">
          Verified attendance
        </p>
        <h1 className="mt-1 text-3xl font-extrabold">
          Secure employee check-in
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Complete the administrator-configured location and live camera checks.
        </p>
      </header>
      <section className="premium-panel grid gap-6 p-5 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="text-sm font-semibold">
            Employee
            <select
              className="input mt-2"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
            >
              <option value="">Select employee</option>
              {employees?.data.items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.firstName} {item.lastName} · {item.employeeId}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Status
              icon={LocateFixed}
              label="Location"
              required={locationRequired}
              done={Boolean(location)}
            />
            <Status
              icon={Camera}
              label="Live selfie"
              required={cameraRequired}
              done={Boolean(image)}
            />
          </div>
          <button
            className="small-button flex items-center gap-2"
            onClick={() => void start()}
          >
            <RefreshCw size={16} />
            Run required checks
          </button>
          {message && (
            <p
              role="status"
              className={`rounded-xl border p-3 text-sm ${message.includes("success") ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-300"}`}
            >
              {message}
            </p>
          )}
          <button
            className="button w-full"
            disabled={busy || !employeeId}
            onClick={() => void submit()}
          >
            {busy ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            Confirm verified check-in
          </button>
        </div>
        <div className="min-h-80 overflow-hidden rounded-2xl border border-[var(--border)] bg-black/30">
          {stream ? (
            <div className="flex h-full flex-col">
              <video
                ref={video}
                autoPlay
                muted
                playsInline
                className="min-h-64 flex-1 object-cover"
              />
              <button className="button m-4" onClick={capture}>
                Capture selfie
              </button>
            </div>
          ) : preview ? (
            <div className="flex h-full flex-col">
              <img
                src={preview}
                alt="Captured check-in selfie"
                className="min-h-64 flex-1 object-cover"
              />
              <button
                className="small-button m-4"
                onClick={() => {
                  URL.revokeObjectURL(preview);
                  setPreview("");
                  setImage(undefined);
                  void openCamera();
                }}
              >
                Retake
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-[var(--text-muted)]">
              <div>
                <Camera className="mx-auto mb-3" />
                Live camera preview appears here when required.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
function Status({
  icon: Icon,
  label,
  required,
  done,
}: {
  icon: any;
  label: string;
  required: boolean;
  done: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3">
      <Icon
        className={done ? "text-emerald-400" : "text-violet-400"}
        size={19}
      />
      <p className="mt-2 text-sm font-bold">{label}</p>
      <p className="text-xs text-[var(--text-muted)]">
        {required ? (done ? "Verified" : "Required") : "Optional"}
      </p>
    </div>
  );
}
