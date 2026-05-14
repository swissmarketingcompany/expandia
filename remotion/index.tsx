import React from 'react';
import {
    AbsoluteFill,
    Composition,
    Sequence,
    interpolate,
    registerRoot,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';

const brand = {
    red: '#cb102c',
    redDark: '#a30d24',
    ink: '#17202a',
    slate: '#334155',
    muted: '#64748b',
    cream: '#fff9e6',
    paper: '#fffdf8',
    line: '#eaded5',
    softRed: '#fde8df',
    green: '#1f7a58',
    blue: '#2f6fdb',
    amber: '#c47b00',
    white: '#ffffff',
};

const ease = (frame: number, start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

const pop = (start: number) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = spring({
        frame: frame - start,
        fps,
        config: { damping: 19, stiffness: 130, mass: 0.85 },
    });

    return {
        opacity: ease(frame, start, start + 16),
        transform: `translateY(${interpolate(scale, [0, 1], [28, 0])}px) scale(${interpolate(scale, [0, 1], [0.97, 1])})`,
    };
};

const slide = (start: number, x = 0, y = 24) => {
    const frame = useCurrentFrame();
    const amount = ease(frame, start, start + 20);
    return {
        opacity: amount,
        transform: `translate(${interpolate(amount, [0, 1], [x, 0])}px, ${interpolate(amount, [0, 1], [y, 0])}px)`,
    };
};

const Shell = ({ children, label = 'AI automation agency near me' }: { children: React.ReactNode; label?: string }) => (
    <AbsoluteFill
        style={{
            backgroundColor: brand.cream,
            backgroundImage:
                'linear-gradient(rgba(203,16,44,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(203,16,44,0.045) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
            color: brand.ink,
            fontFamily: 'Inter, Arial, sans-serif',
            overflow: 'hidden',
        }}
    >
        <div
            style={{
                position: 'absolute',
                top: 38,
                left: 48,
                right: 48,
                height: 54,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: brand.ink,
                fontWeight: 900,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: brand.red,
                        color: brand.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 25,
                        fontWeight: 950,
                    }}
                >
                    +
                </div>
                <div style={{ fontSize: 26, color: brand.red }}>go expandia</div>
            </div>
            <div
                style={{
                    border: `1px solid ${brand.line}`,
                    background: 'rgba(255,255,255,0.74)',
                    padding: '12px 18px',
                    borderRadius: 16,
                    color: brand.slate,
                    fontSize: 20,
                }}
            >
                {label}
            </div>
        </div>
        {children}
    </AbsoluteFill>
);

const Pill = ({ children, tone = 'red' }: { children: React.ReactNode; tone?: 'red' | 'green' | 'blue' | 'amber' }) => {
    const color = tone === 'green' ? brand.green : tone === 'blue' ? brand.blue : tone === 'amber' ? brand.amber : brand.red;
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 16px',
                borderRadius: 999,
                background: `${color}18`,
                border: `1px solid ${color}30`,
                color,
                fontSize: 22,
                fontWeight: 900,
                width: 'fit-content',
            }}
        >
            <span style={{ width: 9, height: 9, borderRadius: 99, background: color }} />
            {children}
        </div>
    );
};

const Panel = ({
    children,
    style = {},
}: {
    children: React.ReactNode;
    style?: React.CSSProperties;
}) => (
    <div
        style={{
            background: 'rgba(255,255,255,0.92)',
            border: `1px solid ${brand.line}`,
            borderRadius: 22,
            boxShadow: '0 22px 58px rgba(23,32,42,0.12)',
            ...style,
        }}
    >
        {children}
    </div>
);

const DataBar = ({ label, value, color = brand.red }: { label: string; value: number; color?: string }) => (
    <div style={{ marginBottom: 17 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: brand.slate, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: '#f1e4db', overflow: 'hidden' }}>
            <div style={{ width: `${value}%`, height: '100%', borderRadius: 99, background: color }} />
        </div>
    </div>
);

const AvatarGroup = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {[brand.red, brand.green, brand.blue, brand.amber].map((color, index) => (
            <div
                key={color}
                style={{
                    width: 48,
                    height: 48,
                    marginLeft: index === 0 ? 0 : -12,
                    borderRadius: 99,
                    border: `4px solid ${brand.white}`,
                    background: color,
                    color: brand.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                    fontSize: 20,
                }}
            >
                {['S', 'O', 'F', 'M'][index]}
            </div>
        ))}
    </div>
);

const FlowNode = ({
    title,
    caption,
    color = brand.red,
    active = true,
}: {
    title: string;
    caption: string;
    color?: string;
    active?: boolean;
}) => (
    <div
        style={{
            border: `2px solid ${active ? color : brand.line}`,
            borderRadius: 18,
            background: brand.white,
            padding: 18,
            boxShadow: active ? `0 16px 36px ${color}22` : '0 8px 24px rgba(23,32,42,0.06)',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, background: color }} />
            <div style={{ fontSize: 25, fontWeight: 950, color: brand.ink }}>{title}</div>
        </div>
        <div style={{ fontSize: 18, color: brand.muted, marginTop: 8, lineHeight: 1.25 }}>{caption}</div>
    </div>
);

const Connector = ({ top, left, width, progress = 1, color = brand.red }: { top: number; left: number; width: number; progress?: number; color?: string }) => (
    <div style={{ position: 'absolute', top, left, width, height: 4, background: `${color}20`, borderRadius: 99 }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: color, borderRadius: 99 }} />
        <div
            style={{
                position: 'absolute',
                right: -7,
                top: -6,
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: `12px solid ${progress > 0.96 ? color : `${color}30`}`,
            }}
        />
    </div>
);

const SearchIntentScene = () => {
    const frame = useCurrentFrame();
    const typed = 'ai automation agency near me';
    const length = Math.floor(interpolate(frame, [24, 88], [0, typed.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    const criteria = ['Workflow audit', 'Local context', 'AI agent build', 'Measured ROI'];

    return (
        <Shell>
            <div style={{ position: 'absolute', left: 74, top: 150, width: 650, ...slide(0) }}>
                <Pill>Search intent</Pill>
                <h1 style={{ margin: '24px 0 18px', fontSize: 72, lineHeight: 0.96, fontWeight: 950, letterSpacing: 0 }}>
                    Your buyer is not looking for AI hype.
                </h1>
                <p style={{ fontSize: 32, lineHeight: 1.25, color: brand.slate, margin: 0 }}>
                    They want a nearby-feeling partner who can understand the workflow and ship the automation.
                </p>
            </div>
            <Panel style={{ position: 'absolute', right: 74, top: 162, width: 478, padding: 24, ...pop(20) }}>
                <div style={{ height: 58, borderRadius: 16, border: `2px solid ${brand.red}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 25, fontWeight: 900, color: brand.ink }}>
                    {typed.slice(0, length)}
                    <span style={{ marginLeft: 3, color: brand.red }}>{frame % 30 < 16 ? '|' : ''}</span>
                </div>
                <div style={{ display: 'grid', gap: 13, marginTop: 22 }}>
                    {criteria.map((item, index) => (
                        <div key={item} style={{ ...slide(92 + index * 14, 16, 0), display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 15, background: index === 0 ? brand.softRed : '#f8fafc', border: `1px solid ${index === 0 ? `${brand.red}33` : '#e2e8f0'}` }}>
                            <div style={{ width: 24, height: 24, borderRadius: 7, background: [brand.red, brand.green, brand.blue, brand.amber][index] }} />
                            <div style={{ fontSize: 23, fontWeight: 900 }}>{item}</div>
                        </div>
                    ))}
                </div>
            </Panel>
            <Panel style={{ position: 'absolute', left: 74, bottom: 62, right: 74, height: 116, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...pop(130) }}>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: brand.red }}>Goal</div>
                    <div style={{ fontSize: 32, fontWeight: 950 }}>Replace manual work with a controlled AI pilot.</div>
                </div>
                <AvatarGroup />
            </Panel>
        </Shell>
    );
};

const AuditScene = () => {
    const frame = useCurrentFrame();
    const sources = [
        ['CRM', 'Lead fields, owners, follow-ups', brand.red],
        ['Inbox', 'Customer requests and handoffs', brand.blue],
        ['Invoices', 'PDFs, mismatches, approvals', brand.amber],
        ['Support', 'Tickets, categories, escalations', brand.green],
    ] as const;

    return (
        <Shell label="workflow audit">
            <div style={{ position: 'absolute', left: 66, top: 142, width: 490, ...slide(210) }}>
                <Pill tone="blue">Step 1</Pill>
                <h2 style={{ fontSize: 62, lineHeight: 1, margin: '24px 0 16px', fontWeight: 950 }}>
                    Audit the systems where work gets stuck.
                </h2>
                <p style={{ fontSize: 29, lineHeight: 1.28, color: brand.slate, margin: 0 }}>
                    The first job is not choosing a model. It is understanding where time, errors, and approvals pile up.
                </p>
            </div>
            <div style={{ position: 'absolute', right: 70, top: 132, width: 604, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {sources.map(([title, caption, color], index) => {
                    const active = ease(frame, 260 + index * 22, 286 + index * 22);
                    return (
                        <div key={title} style={{ ...slide(246 + index * 18), opacity: active }}>
                            <FlowNode title={title} caption={caption} color={color} active={active > 0.6} />
                        </div>
                    );
                })}
            </div>
            <Panel style={{ position: 'absolute', left: 66, right: 70, bottom: 68, padding: 28, ...pop(338) }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
                    <DataBar label="Manual routing" value={82} color={brand.red} />
                    <DataBar label="Data re-entry" value={67} color={brand.amber} />
                    <DataBar label="Repeat questions" value={74} color={brand.blue} />
                </div>
            </Panel>
        </Shell>
    );
};

const AutomationMapScene = () => {
    const frame = useCurrentFrame();
    const progress = ease(frame, 520, 650);

    return (
        <Shell label="automation map">
            <div style={{ position: 'absolute', left: 72, top: 132, right: 72, ...slide(450) }}>
                <Pill tone="green">Step 2</Pill>
                <h2 style={{ fontSize: 58, lineHeight: 1, margin: '22px 0 0', fontWeight: 950 }}>
                    Build the pilot around the exact handoff.
                </h2>
            </div>
            <Panel style={{ position: 'absolute', left: 72, right: 72, top: 288, height: 320, padding: 30, ...pop(492) }}>
                <Connector top={150} left={238} width={178} progress={progress} color={brand.red} />
                <Connector top={150} left={550} width={178} progress={Math.max(0, progress - 0.2) / 0.8} color={brand.blue} />
                <Connector top={150} left={862} width={178} progress={Math.max(0, progress - 0.45) / 0.55} color={brand.green} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 34, position: 'relative', zIndex: 2 }}>
                    <FlowNode title="Input" caption="Lead, invoice, ticket, or document arrives" color={brand.red} />
                    <FlowNode title="AI agent" caption="Classifies, drafts, enriches, and checks context" color={brand.blue} />
                    <FlowNode title="Human gate" caption="Approves exceptions and sensitive actions" color={brand.amber} />
                    <FlowNode title="System update" caption="CRM, inbox, ERP, or dashboard is updated" color={brand.green} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 28 }}>
                    <div style={{ padding: 18, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 18, color: brand.muted, fontWeight: 900 }}>Before</div>
                        <div style={{ fontSize: 28, color: brand.ink, fontWeight: 950 }}>6 manual steps, no audit trail</div>
                    </div>
                    <div style={{ padding: 18, borderRadius: 16, background: brand.softRed, border: `1px solid ${brand.red}30` }}>
                        <div style={{ fontSize: 18, color: brand.red, fontWeight: 900 }}>After</div>
                        <div style={{ fontSize: 28, color: brand.ink, fontWeight: 950 }}>1 controlled workflow with approvals</div>
                    </div>
                </div>
            </Panel>
        </Shell>
    );
};

const AgentApprovalScene = () => {
    const frame = useCurrentFrame();
    const tasks = [
        ['Draft reply to inbound lead', 'Ready for review', brand.blue],
        ['Compare invoice to PO', 'Mismatch flagged', brand.amber],
        ['Update CRM owner', 'Approved', brand.green],
        ['Escalate support ticket', 'Human decision', brand.red],
    ] as const;

    return (
        <Shell label="AI agent with human control">
            <div style={{ position: 'absolute', left: 70, top: 134, width: 530, ...slide(700) }}>
                <Pill tone="amber">Step 3</Pill>
                <h2 style={{ fontSize: 58, lineHeight: 1, margin: '22px 0 16px', fontWeight: 950 }}>
                    Let the agent work. Keep the business in control.
                </h2>
                <p style={{ fontSize: 29, color: brand.slate, lineHeight: 1.28, margin: 0 }}>
                    The agent handles routine actions while approvals, logs, and exception rules protect the workflow.
                </p>
            </div>
            <Panel style={{ position: 'absolute', right: 70, top: 132, width: 560, padding: 24, ...pop(730) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ fontSize: 28, fontWeight: 950 }}>Agent command center</div>
                    <Pill tone="green">Live pilot</Pill>
                </div>
                {tasks.map(([task, status, color], index) => {
                    const reveal = ease(frame, 770 + index * 26, 792 + index * 26);
                    return (
                        <div key={task} style={{ ...slide(760 + index * 24, 18, 0), opacity: reveal, display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center', padding: '16px 0', borderTop: index === 0 ? 'none' : `1px solid ${brand.line}` }}>
                            <div>
                                <div style={{ fontSize: 25, fontWeight: 950, color: brand.ink }}>{task}</div>
                                <div style={{ fontSize: 18, color: brand.muted, marginTop: 4 }}>Policy checked, source linked, audit log saved</div>
                            </div>
                            <div style={{ padding: '10px 13px', borderRadius: 13, background: `${color}18`, color, fontSize: 18, fontWeight: 950 }}>
                                {status}
                            </div>
                        </div>
                    );
                })}
            </Panel>
        </Shell>
    );
};

const ResultsScene = () => {
    const frame = useCurrentFrame();
    const metrics = [
        ['42 hrs', 'monthly manual work removed', brand.red],
        ['38%', 'faster first response', brand.green],
        ['24/7', 'triage and routing coverage', brand.blue],
    ] as const;

    return (
        <Shell label="measured rollout">
            <div style={{ position: 'absolute', left: 82, right: 82, top: 144, textAlign: 'center', ...slide(930) }}>
                <Pill tone="green">Result</Pill>
                <h2 style={{ margin: '26px auto 18px', fontSize: 72, lineHeight: 0.96, fontWeight: 950, maxWidth: 980 }}>
                    The right agency turns AI into operational numbers.
                </h2>
                <p style={{ margin: '0 auto', fontSize: 30, lineHeight: 1.3, color: brand.slate, maxWidth: 880 }}>
                    Use the pilot to prove the case, then expand into agents, dashboards, and custom AI systems.
                </p>
            </div>
            <div style={{ position: 'absolute', left: 82, right: 82, top: 440, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
                {metrics.map(([number, caption, color], index) => (
                    <Panel key={caption} style={{ padding: 28, textAlign: 'center', borderTop: `8px solid ${color}`, ...pop(1010 + index * 28) }}>
                        <div style={{ fontSize: 56, color, fontWeight: 950 }}>{number}</div>
                        <div style={{ fontSize: 22, color: brand.slate, fontWeight: 850, marginTop: 10 }}>{caption}</div>
                    </Panel>
                ))}
            </div>
            <div style={{ position: 'absolute', left: 82, right: 82, bottom: 58, display: 'flex', justifyContent: 'center', ...pop(1110) }}>
                <div style={{ padding: '22px 34px', borderRadius: 18, background: brand.red, color: brand.white, fontSize: 31, fontWeight: 950, boxShadow: '0 18px 44px rgba(203,16,44,0.25)' }}>
                    goexpandia.com/contact
                </div>
            </div>
        </Shell>
    );
};

const HeroImage = () => (
    <Shell label="local AI automation workshop">
        <div style={{ position: 'absolute', left: 72, top: 150, width: 575 }}>
            <Pill>AI automation agency near me</Pill>
            <h1 style={{ fontSize: 64, lineHeight: 1, fontWeight: 950, margin: '26px 0 20px' }}>
                From local business workflow to working AI pilot.
            </h1>
            <p style={{ fontSize: 28, lineHeight: 1.32, color: brand.slate }}>
                A branded implementation workspace: search intent, workflow audit, agent control, and KPI tracking in one operating view.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34 }}>
                <AvatarGroup />
                <div style={{ fontSize: 20, color: brand.muted, fontWeight: 850 }}>Sales, operations, finance, and support aligned.</div>
            </div>
        </div>
        <Panel style={{ position: 'absolute', right: 74, top: 142, width: 790, height: 660, padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 22 }}>
                <div>
                    <FlowNode title="Workflow audit" caption="CRM, inbox, documents, approvals" color={brand.red} />
                    <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <FlowNode title="AI agent" caption="Classify, draft, enrich" color={brand.blue} />
                        <FlowNode title="Human gate" caption="Approve sensitive actions" color={brand.amber} />
                    </div>
                    <Panel style={{ marginTop: 22, padding: 20, boxShadow: 'none' }}>
                        <DataBar label="Automation readiness" value={84} color={brand.red} />
                        <DataBar label="Data quality" value={71} color={brand.blue} />
                        <DataBar label="Pilot value" value={92} color={brand.green} />
                    </Panel>
                </div>
                <div style={{ display: 'grid', gap: 16 }}>
                    <Panel style={{ padding: 20, borderTop: `7px solid ${brand.red}`, boxShadow: 'none' }}>
                        <div style={{ fontSize: 42, color: brand.red, fontWeight: 950 }}>2-6</div>
                        <div style={{ fontSize: 19, color: brand.slate, fontWeight: 850 }}>weeks to first pilot</div>
                    </Panel>
                    <Panel style={{ padding: 20, borderTop: `7px solid ${brand.green}`, boxShadow: 'none' }}>
                        <div style={{ fontSize: 42, color: brand.green, fontWeight: 950 }}>42h</div>
                        <div style={{ fontSize: 19, color: brand.slate, fontWeight: 850 }}>manual work target</div>
                    </Panel>
                    <Panel style={{ padding: 20, borderTop: `7px solid ${brand.blue}`, boxShadow: 'none' }}>
                        <div style={{ fontSize: 42, color: brand.blue, fontWeight: 950 }}>1</div>
                        <div style={{ fontSize: 19, color: brand.slate, fontWeight: 850 }}>controlled workflow</div>
                    </Panel>
                </div>
            </div>
        </Panel>
    </Shell>
);

const WorkflowImage = () => (
    <Shell label="workflow map">
        <div style={{ position: 'absolute', left: 80, top: 140, right: 80 }}>
            <Pill tone="green">Automation map</Pill>
            <h1 style={{ margin: '24px 0 28px', fontSize: 62, lineHeight: 1, fontWeight: 950 }}>
                Before and after: one handoff becomes a controlled AI workflow.
            </h1>
        </div>
        <Panel style={{ position: 'absolute', left: 80, right: 80, top: 330, height: 440, padding: 34 }}>
            <Connector top={205} left={286} width={245} progress={1} color={brand.red} />
            <Connector top={205} left={645} width={245} progress={1} color={brand.blue} />
            <Connector top={205} left={1004} width={245} progress={1} color={brand.green} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 34, position: 'relative', zIndex: 2 }}>
                <FlowNode title="Input" caption="Customer, invoice, ticket, or lead arrives" color={brand.red} />
                <FlowNode title="Agent" caption="Reads context and prepares next action" color={brand.blue} />
                <FlowNode title="Approval" caption="Human gate for exceptions and risk" color={brand.amber} />
                <FlowNode title="Update" caption="CRM, ERP, inbox, or dashboard updated" color={brand.green} />
            </div>
            <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <DataBar label="Manual steps removed" value={76} color={brand.red} />
                <DataBar label="Exception coverage" value={91} color={brand.amber} />
                <DataBar label="Audit visibility" value={88} color={brand.green} />
            </div>
        </Panel>
    </Shell>
);

const AgentImage = () => (
    <Shell label="agent command center">
        <div style={{ position: 'absolute', left: 80, top: 140, width: 520 }}>
            <Pill tone="amber">Human-controlled AI agent</Pill>
            <h1 style={{ margin: '24px 0 18px', fontSize: 60, lineHeight: 1, fontWeight: 950 }}>
                The agent handles routine tasks. People approve the important ones.
            </h1>
            <p style={{ fontSize: 27, lineHeight: 1.32, color: brand.slate }}>
                This is what the article means by safe automation: source links, decision gates, and audit logs.
            </p>
        </div>
        <Panel style={{ position: 'absolute', right: 82, top: 132, width: 790, padding: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 34, fontWeight: 950 }}>Task queue</div>
                <Pill tone="green">Pilot running</Pill>
            </div>
            {[
                ['Lead reply drafted', 'Needs approval', brand.amber],
                ['Invoice mismatch found', 'Escalated', brand.red],
                ['Support ticket categorized', 'Auto-routed', brand.green],
                ['CRM record enriched', 'Approved', brand.blue],
            ].map(([task, status, color], index) => (
                <div key={task} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', padding: '22px 0', borderTop: index === 0 ? 'none' : `1px solid ${brand.line}` }}>
                    <div>
                        <div style={{ fontSize: 29, fontWeight: 950 }}>{task}</div>
                        <div style={{ fontSize: 19, color: brand.muted, marginTop: 5 }}>Source linked, policy checked, log saved</div>
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 14, color, background: `${color}18`, fontSize: 21, fontWeight: 950 }}>
                        {status}
                    </div>
                </div>
            ))}
        </Panel>
    </Shell>
);

const RoiImage = () => (
    <Shell label="measured rollout">
        <div style={{ position: 'absolute', left: 80, top: 136, right: 80, textAlign: 'center' }}>
            <Pill tone="green">ROI dashboard</Pill>
            <h1 style={{ margin: '24px auto 22px', fontSize: 62, lineHeight: 1, fontWeight: 950, maxWidth: 1100 }}>
                A good AI automation agency proves the pilot in operating metrics.
            </h1>
        </div>
        <div style={{ position: 'absolute', left: 84, right: 84, top: 352, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
                ['42 hrs', 'manual work saved monthly', brand.red],
                ['38%', 'faster first response', brand.green],
                ['18', 'exceptions caught before handoff', brand.blue],
            ].map(([metric, caption, color]) => (
                <Panel key={caption} style={{ padding: 34, textAlign: 'center', borderTop: `9px solid ${color}` }}>
                    <div style={{ fontSize: 68, fontWeight: 950, color }}>{metric}</div>
                    <div style={{ fontSize: 24, color: brand.slate, fontWeight: 850, marginTop: 10 }}>{caption}</div>
                </Panel>
            ))}
        </div>
        <Panel style={{ position: 'absolute', left: 190, right: 190, bottom: 90, padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 22 }}>
                {['Discover', 'Pilot', 'Train', 'Scale'].map((item, index) => (
                    <div key={item} style={{ textAlign: 'center' }}>
                        <div style={{ margin: '0 auto 12px', width: 40, height: 40, borderRadius: 13, background: [brand.red, brand.blue, brand.amber, brand.green][index], color: brand.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 950 }}>{index + 1}</div>
                        <div style={{ fontSize: 23, fontWeight: 950 }}>{item}</div>
                    </div>
                ))}
            </div>
        </Panel>
    </Shell>
);

export const AiAutomationAgencyNearMeVideo = () => (
    <AbsoluteFill>
        <Sequence from={0} durationInFrames={210}>
            <SearchIntentScene />
        </Sequence>
        <Sequence from={210} durationInFrames={240}>
            <AuditScene />
        </Sequence>
        <Sequence from={450} durationInFrames={250}>
            <AutomationMapScene />
        </Sequence>
        <Sequence from={700} durationInFrames={230}>
            <AgentApprovalScene />
        </Sequence>
        <Sequence from={930} durationInFrames={240}>
            <ResultsScene />
        </Sequence>
    </AbsoluteFill>
);

const Root = () => (
    <>
        <Composition
            id="AiAutomationAgencyNearMe"
            component={AiAutomationAgencyNearMeVideo}
            durationInFrames={1170}
            fps={30}
            width={1280}
            height={720}
        />
        <Composition id="AiAutomationHeroImage" component={HeroImage} durationInFrames={1} fps={30} width={1600} height={1000} />
        <Composition id="AiAutomationWorkflowMapImage" component={WorkflowImage} durationInFrames={1} fps={30} width={1600} height={1000} />
        <Composition id="AiAgentHumanApprovalImage" component={AgentImage} durationInFrames={1} fps={30} width={1600} height={1000} />
        <Composition id="AiAutomationRoiDashboardImage" component={RoiImage} durationInFrames={1} fps={30} width={1600} height={1000} />
    </>
);

registerRoot(Root);
