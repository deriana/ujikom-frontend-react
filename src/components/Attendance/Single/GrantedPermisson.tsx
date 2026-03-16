import { Camera, CheckCircle2, Info, Settings, ShieldCheck, XCircle, MapPin, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PermissionStatus = "loading" | "prompt" | "granted" | "denied";

interface PermissionState {
  camera: PermissionStatus;
  location: PermissionStatus;
}

interface GrantedPermissionProps {
  permissions: PermissionState;
  isAnyDenied: boolean;
  requestAccess: () => Promise<void>;
}

export default function GrantedPermission({ permissions, isAnyDenied, requestAccess }: GrantedPermissionProps) {
    const navigate = useNavigate();

    return(
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 z-9999">
        <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="space-y-2">
            <div className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-4">
              <ShieldCheck className="text-indigo-500" size={40} />
            </div>
            <h2 className="text-2xl font-black text-white">Access Required</h2>
            <p className="text-zinc-400 text-sm">To start attendance, we need permission to access your camera and location.</p>
          </div>

          <div className="grid gap-4">
            <div className={`flex items-center justify-between p-5 rounded-2xl border backdrop-blur-md transition-all ${permissions.camera === 'granted' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${permissions.camera === 'granted' ? 'bg-emerald-500 text-white' : permissions.camera === 'denied' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Camera size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Camera Permission</p>
                  <p className="text-xs text-zinc-500">{permissions.camera === 'granted' ? 'Granted' : permissions.camera === 'denied' ? 'Blocked' : 'Waiting...'}</p>
                </div>
              </div>
              {permissions.camera === 'granted' && <CheckCircle2 className="text-emerald-500" size={20} />}
              {permissions.camera === 'denied' && <XCircle className="text-red-500" size={20} />}
            </div>

            <div className={`flex items-center justify-between p-5 rounded-2xl border backdrop-blur-md transition-all ${permissions.location === 'granted' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${permissions.location === 'granted' ? 'bg-emerald-500 text-white' : permissions.location === 'denied' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Location Permission (GPS)</p>
                  <p className="text-xs text-zinc-500">{permissions.location === 'granted' ? 'Granted' : permissions.location === 'denied' ? 'Blocked' : 'Waiting...'}</p>
                </div>
              </div>
              {permissions.location === 'granted' && <CheckCircle2 className="text-emerald-500" size={20} />}
              {permissions.location === 'denied' && <XCircle className="text-red-500" size={20} />}
            </div>
          </div>

          {isAnyDenied ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-500 justify-center">
                <Lock size={18} />
                <span className="font-bold text-sm">Access Permanently Blocked</span>
              </div>
              <div className="text-xs text-zinc-400 space-y-2 text-left">
                <p className="font-semibold text-zinc-300">How to re-enable:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Click the <Info className="inline" size={12}/>, <Settings className="inline" size={12}/> or <Lock className="inline" size={12}/> icon in your browser address bar.</li>
                  <li>Change Camera & Location permissions to <strong>'Allow'</strong>.</li>
                  <li>Refresh this page.</li>
                </ol>
              </div>
            </div>
          ) : (
            <button
              onClick={requestAccess}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            >
              ENABLE ATTENDANCE ACCESS
            </button>
          )}
          
          <button onClick={() => navigate(-1)} className="text-zinc-500 text-sm font-medium hover:text-white transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    )
}