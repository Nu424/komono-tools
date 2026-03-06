import React, { useState } from 'react';
import { Settings, Activity, Info, Save } from 'lucide-react';

// --- SVG描画用のヘルパーコンポーネント (再レンダリング時のフォーカス外れを防ぐためコンポーネント外に定義) ---

// 両矢印コンポーネント
const DoubleArrow = ({ x1, x2, y }) => (
    <g>
        <line
            x1={x1 + 6} y1={y} x2={x2 - 6} y2={y}
            stroke="#4b5563" strokeWidth="1.5"
            markerStart="url(#arrow)" markerEnd="url(#arrow)"
        />
    </g>
);

// SVG上の入力ボックスコンポーネント (foreignObjectを使用)
const ParameterInput = ({ x, y, value, onChange, label, width = 60 }) => (
    <foreignObject x={x - 60} y={y - 40} width="120" height="80" className="overflow-visible">
        <div className="flex flex-col items-center justify-center w-full h-full pointer-events-none">
            <div className="bg-white/95 p-1 rounded shadow-md border border-gray-300 flex flex-col items-center pointer-events-auto hover:border-blue-400 transition-colors">
                <input
                    type="text" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="rounded px-1 py-1 text-center font-mono text-sm focus:bg-blue-50 focus:outline-none"
                    style={{ width: `${width}px` }}
                />
                {label && <span className="text-[10px] font-bold text-gray-600 mt-0.5 whitespace-nowrap">{label}</span>}
            </div>
        </div>
    </foreignObject>
);

// ラベル用コンポーネント
const LabelBox = ({ x, y, text }) => (
    <foreignObject x={x - 30} y={y - 20} width="60" height="40">
        <div className="flex items-center justify-center w-full h-full">
            <div className="border-2 border-gray-600 bg-white rounded px-2 py-1 text-sm font-bold shadow-sm text-gray-800">
                {text}
            </div>
        </div>
    </foreignObject>
);

export default function XAFSParameterUI() {
    // 測定パラメータのステート管理 (テキストとして保持)
    const [params, setParams] = useState({
        e0: "8979",         // 吸収端エネルギー (例: Cu K-edge)
        epreMin: "200",     // Pre-edge 領域の始まりから E0 までの広さ (eV)
        epreMax: "20",      // Pre-edge 領域の終わりから E0 までの広さ (eV)
        xanesKEnd: "3",     // E0 から XANES 領域の終わりまでの広さ (k)
        exafsMaxK: "15",    // EXAFS 領域の終了点 (k)
    });

    const handleChange = (key, value) => {
        setParams(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // 測定点数の推定計算 (UI用のモック計算用に数値パース)
    const e0Num = parseFloat(params.e0) || 0;
    const epreMinNum = parseFloat(params.epreMin) || 0;
    const epreMaxNum = parseFloat(params.epreMax) || 0;
    const xanesKEndNum = parseFloat(params.xanesKEnd) || 0;
    const exafsMaxKNum = parseFloat(params.exafsMaxK) || 0;

    const totalPoints = Math.ceil((epreMinNum / 5) + (epreMaxNum / 0.5) + (exafsMaxKNum / 0.05));

    // --- SVG描画用の定数・関数 ---
    const X_START = 120;
    const X_EDGE_START = 260; // XANESをPre-edge側に少し伸ばす
    const X_E0 = 360;         // E0の位置 (XANESの中央・急上昇部に対応)
    const X_EDGE_END = 480;
    const X_END = 780;
    const Y_BASE = 360;
    const Y_PEAK = 120;
    const Y_EXAFS_BASE = 250;

    // 各領域のスペクトルパス生成
    const preEdgePath = `M ${X_START} ${Y_BASE + 15} Q ${(X_START + X_EDGE_START) / 2} ${Y_BASE + 20} ${X_EDGE_START} ${Y_BASE + 10}`;

    const xanesPath = `M ${X_EDGE_START} ${Y_BASE + 10} C 330 ${Y_BASE + 5}, 340 ${Y_PEAK}, ${X_E0 + 20} ${Y_PEAK} C 430 ${Y_PEAK}, 440 ${Y_EXAFS_BASE}, ${X_EDGE_END} ${Y_EXAFS_BASE}`;

    const generateEXAFSPath = () => {
        let path = `M ${X_EDGE_END} ${Y_EXAFS_BASE}`;
        for (let x = X_EDGE_END + 5; x <= X_END; x += 5) {
            const dx = x - X_EDGE_END;
            const decay = Math.exp(-dx / 120);
            const freq = 0.05 + dx * 0.00015;
            const y = Y_EXAFS_BASE - 50 * decay * Math.sin(dx * freq);
            path += ` L ${x} ${y}`;
        }
        return path;
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 p-6 bg-gray-50 min-h-screen font-sans">

            {/* 左側: インタラクティブSVG UI */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Visual Parameter Setup</h2>
                </div>

                <div className="w-full overflow-x-auto">
                    {/* viewBoxのY方向を拡大し、下側の入力欄が見切れないように修正 */}
                    <svg viewBox="0 0 850 560" className="w-full h-auto min-w-[800px] bg-slate-50/50 rounded-xl">
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 2 L 10 5 L 0 8 z" fill="#4b5563" />
                            </marker>
                        </defs>

                        {/* 領域ハイライト背景 */}
                        <rect x={X_START} y={50} width={X_EDGE_START - X_START} height={400} fill="#3b82f6" fillOpacity="0.03" />
                        <rect x={X_EDGE_START} y={50} width={X_EDGE_END - X_EDGE_START} height={400} fill="#ef4444" fillOpacity="0.03" />
                        <rect x={X_EDGE_END} y={50} width={X_END - X_EDGE_END} height={400} fill="#10b981" fillOpacity="0.03" />

                        {/* 領域タイトル */}
                        <text x={(X_START + X_EDGE_START) / 2} y={35} textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="14">Pre-edge</text>
                        <text x={(X_EDGE_START + X_EDGE_END) / 2} y={35} textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="14">XANES / Edge</text>
                        <text x={(X_EDGE_END + X_END) / 2} y={35} textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="14">EXAFS</text>

                        {/* 縦の区切り線 */}
                        {/* Epre_min の矢印のために一番左の線とE0の線を下に伸ばす */}
                        <line x1={X_START} y1={50} x2={X_START} y2={510} stroke="#94a3b8" strokeWidth="1" />
                        <line x1={X_EDGE_START} y1={50} x2={X_EDGE_START} y2={450} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,5" />
                        <line x1={X_EDGE_END} y1={50} x2={X_EDGE_END} y2={450} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,5" />
                        {/* k max の線は実線に変更 */}
                        <line x1={X_END} y1={50} x2={X_END} y2={450} stroke="#94a3b8" strokeWidth="1.5" />

                        {/* 横軸のベースライン（うっすら） */}
                        <line x1={80} y1={Y_BASE + 20} x2={X_END + 30} y2={Y_BASE + 20} stroke="#e2e8f0" strokeWidth="1" />

                        {/* スペクトル描画 */}
                        <path d={preEdgePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                        <path d={xanesPath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                        <path d={generateEXAFSPath()} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {/* --- E0 の縦線 (最重要) --- */}
                        <line x1={X_E0} y1={50} x2={X_E0} y2={510} stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" />

                        {/* スケッチに基づくラベル */}
                        <LabelBox x={70} y={70} text="k" />
                        <LabelBox x={70} y={430} text="eV" />

                        {/* k基準の 0 (E0の縦線上側) */}
                        <LabelBox x={X_E0} y={70} text="0" />

                        {/* 矢印と入力欄 */}

                        {/* 1. Epre_min (Pre-edge始まり 〜 E0) / eV単位 (下側) - Y座標を上げて見切れを修正 */}
                        <DoubleArrow x1={X_START} x2={X_E0} y={510} />
                        <ParameterInput x={(X_START + X_E0) / 2} y={510} value={params.epreMin} onChange={(v) => handleChange('epreMin', v)} label="Epre_min" />

                        {/* 2. Epre_max (Pre-edge終わり 〜 E0) / eV単位 (下側) - Y座標を上げて見切れを修正 */}
                        <DoubleArrow x1={X_EDGE_START} x2={X_E0} y={450} />
                        <ParameterInput x={(X_EDGE_START + X_E0) / 2} y={450} value={params.epreMax} onChange={(v) => handleChange('epreMax', v)} label="Epre_max" />

                        {/* 3. E0 (吸収端) / E0のオレンジ点線上に配置 */}
                        <ParameterInput x={X_E0} y={280} value={params.e0} onChange={(v) => handleChange('e0', v)} label="E0 (eV)" width={70} />

                        {/* 4. XANES_k_end (E0 〜 XANES終わり) / k単位 (上側) / XANES領域の終わりの点線上に配置 */}
                        <DoubleArrow x1={X_E0} x2={X_EDGE_END} y={110} />
                        <ParameterInput x={X_EDGE_END} y={80} value={params.xanesKEnd} onChange={(v) => handleChange('xanesKEnd', v)} label="XANES_k_end" />

                        {/* 5. k max (EXAFS終了点) / k単位 (上側) */}
                        <ParameterInput x={X_END} y={80} value={params.exafsMaxK} onChange={(v) => handleChange('exafsMaxK', v)} label="k max" />

                    </svg>
                </div>
            </div>

            {/* 右側: パラメータ詳細・確認パネル */}
            <div className="w-full xl:w-80 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                <div className="p-5 border-b border-gray-100 bg-slate-50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <Settings className="text-gray-700" size={20} />
                        <h3 className="font-bold text-gray-800">Scan Parameters</h3>
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto">

                    {/* Edge Info */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 block">Edge Energy</label>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-mono text-blue-900">{e0Num.toFixed(1)}</span>
                            <span className="text-sm text-blue-600 font-bold">eV</span>
                        </div>
                    </div>

                    {/* Regions Summary */}
                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-3">
                            <h4 className="text-sm font-bold text-gray-700 mb-1">Pre-edge Region</h4>
                            <p className="text-xs text-gray-500 mb-1">Start: E0 - {params.epreMin} eV</p>
                            <p className="text-sm font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">End: E0 - {params.epreMax} eV</p>
                        </div>

                        <div className="border-l-4 border-red-500 pl-3">
                            <h4 className="text-sm font-bold text-gray-700 mb-1">XANES Region</h4>
                            <p className="text-xs text-gray-500 mb-1">eV Range: E0 - {params.epreMax} eV to E0</p>
                            <p className="text-sm font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">k Range: 0 to {params.xanesKEnd} k</p>
                        </div>

                        <div className="border-l-4 border-emerald-500 pl-3">
                            <h4 className="text-sm font-bold text-gray-700 mb-1">EXAFS Region</h4>
                            <p className="text-xs text-gray-500 mb-1">Start: {params.xanesKEnd} k</p>
                            <p className="text-sm font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">End: {params.exafsMaxK} k</p>
                        </div>
                    </div>

                    {/* Point Calculation */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Info size={16} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold mb-1">Estimated Data Points</p>
                                <p className="text-xl font-mono text-gray-800">{totalPoints} <span className="text-sm font-sans text-gray-500">pts</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-200">
                        <Save size={18} />
                        Apply Parameters
                    </button>
                </div>
            </div>

        </div>
    );
}