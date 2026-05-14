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
    redDark: '#9f0d23',
    ink: '#141b2a',
    slate: '#3d4a5f',
    muted: '#667085',
    cream: '#fff9e6',
    white: '#ffffff',
    line: '#eaded5',
    green: '#197a55',
    blue: '#2f6fdb',
    amber: '#c47b00',
};

const clamp = {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
};

const ease = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [0, 1], clamp);

const pop = (start: number) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const value = spring({
        frame: frame - start,
        fps,
        config: { damping: 18, stiffness: 150, mass: 0.82 },
    });

    return {
        opacity: ease(frame, start, start + 12),
        transform: `translateY(${interpolate(value, [0, 1], [24, 0])}px) scale(${interpolate(value, [0, 1], [0.96, 1])})`,
    };
};

const Shell = ({ children, label }: { children: React.ReactNode; label: string }) => {
    const frame = useCurrentFrame();
    const drift = interpolate(frame, [0, 660], [0, 36], clamp);

    return (
        <AbsoluteFill
            style={{
                background: brand.cream,
                backgroundImage:
                    'linear-gradient(rgba(203,16,44,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(203,16,44,0.05) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
                backgroundPosition: `${-drift}px ${-drift * 0.6}px`,
                color: brand.ink,
                fontFamily: 'Inter, Arial, sans-serif',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 34,
                    left: 46,
                    right: 46,
                    height: 54,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 950,
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
                            fontSize: 26,
                        }}
                    >
                        +
                    </div>
                    <div style={{ fontSize: 26, color: brand.red }}>go expandia</div>
                </div>
                <div
                    style={{
                        border: `1px solid ${brand.line}`,
                        background: 'rgba(255,255,255,0.82)',
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
};

const Pill = ({ children, color = brand.red }: { children: React.ReactNode; color?: string }) => (
    <div
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 16px',
            borderRadius: 999,
            background: `${color}16`,
            border: `1px solid ${color}35`,
            color,
            fontSize: 22,
            fontWeight: 950,
            width: 'fit-content',
        }}
    >
        <span style={{ width: 9, height: 9, borderRadius: 99, background: color }} />
        {children}
    </div>
);

const Panel = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div
        style={{
            background: 'rgba(255,255,255,0.94)',
            border: `1px solid ${brand.line}`,
            borderRadius: 22,
            boxShadow: '0 22px 56px rgba(20,27,42,0.13)',
            ...style,
        }}
    >
        {children}
    </div>
);

const Progress = () => {
    const frame = useCurrentFrame();
    const width = interpolate(frame, [0, 659], [0, 100], clamp);
    return (
        <div style={{ position: 'absolute', left: 46, right: 46, bottom: 28, height: 7, borderRadius: 99, background: '#efdfd6', overflow: 'hidden' }}>
            <div style={{ width: `${width}%`, height: '100%', background: brand.red, borderRadius: 99 }} />
        </div>
    );
};

const SearchScene = () => {
    const frame = useCurrentFrame();
    const query = 'ai automation agency near me';
    const count = Math.floor(interpolate(frame, [18, 84], [0, query.length], clamp));
    const results = ['Workflow audit', 'AI agent build', 'Human approval', 'ROI dashboard'];

    return (
        <Shell label="search intent">
            <div style={{ position: 'absolute', left: 74, top: 142, width: 600, ...pop(0) }}>
                <Pill>Scene 1: buyer intent</Pill>
                <h1 style={{ margin: '24px 0 18px', fontSize: 70, lineHeight: 0.96, fontWeight: 950 }}>
                    They are not searching for AI hype.
                </h1>
                <p style={{ margin: 0, fontSize: 31, lineHeight: 1.28, color: brand.slate }}>
                    They want a local-feeling partner who can understand the workflow and launch the pilot.
                </p>
            </div>
            <Panel style={{ position: 'absolute', right: 74, top: 148, width: 510, padding: 26, ...pop(24) }}>
                <div
                    style={{
                        height: 62,
                        borderRadius: 18,
                        border: `2px solid ${brand.red}`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        fontSize: 26,
                        fontWeight: 950,
                    }}
                >
                    {query.slice(0, count)}
                    <span style={{ color: brand.red }}>{frame % 26 < 13 ? '|' : ''}</span>
                </div>
                <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
                    {results.map((item, index) => {
                        const reveal = ease(frame, 88 + index * 12, 104 + index * 12);
                        return (
                            <div
                                key={item}
                                style={{
                                    opacity: reveal,
                                    transform: `translateX(${interpolate(reveal, [0, 1], [28, 0])}px)`,
                                    padding: '14px 16px',
                                    borderRadius: 15,
                                    background: index === 0 ? '#fde8df' : '#f8fafc',
                                    border: `1px solid ${index === 0 ? `${brand.red}40` : '#e2e8f0'}`,
                                    fontSize: 24,
                                    fontWeight: 950,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                <span style={{ width: 20, height: 20, borderRadius: 6, background: [brand.red, brand.blue, brand.amber, brand.green][index] }} />
                                {item}
                            </div>
                        );
                    })}
                </div>
            </Panel>
            <Progress />
        </Shell>
    );
};

const MovingCard = ({ title, caption, color, index }: { title: string; caption: string; color: string; index: number }) => {
    const frame = useCurrentFrame();
    const phase = (frame + index * 18) % 86;
    const lift = interpolate(phase, [0, 43, 86], [0, -12, 0]);

    return (
        <div
            style={{
                padding: 18,
                borderRadius: 18,
                border: `2px solid ${color}`,
                background: brand.white,
                transform: `translateY(${lift}px)`,
                boxShadow: `0 16px 32px ${color}25`,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, background: color }} />
                <div style={{ fontSize: 27, fontWeight: 950 }}>{title}</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 19, color: brand.muted, lineHeight: 1.25 }}>{caption}</div>
        </div>
    );
};

const WorkflowScene = () => {
    const frame = useCurrentFrame();
    const flow = ease(frame, 35, 152);

    return (
        <Shell label="workflow audit">
            <div style={{ position: 'absolute', left: 72, top: 132, right: 72, ...pop(0) }}>
                <Pill color={brand.blue}>Scene 2: workflow audit</Pill>
                <h2 style={{ margin: '22px 0 0', fontSize: 60, lineHeight: 1, fontWeight: 950 }}>
                    Map the stuck handoff before building anything.
                </h2>
            </div>
            <Panel style={{ position: 'absolute', left: 72, right: 72, top: 302, height: 312, padding: 30, ...pop(25) }}>
                <div style={{ position: 'absolute', left: 256, right: 256, top: 150, height: 5, borderRadius: 99, background: '#eaded5' }}>
                    <div style={{ width: `${flow * 100}%`, height: '100%', borderRadius: 99, background: brand.red }} />
                </div>
                <div
                    style={{
                        position: 'absolute',
                        left: interpolate(flow, [0, 1], [236, 994]),
                        top: 132,
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        background: brand.red,
                        color: brand.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        fontWeight: 950,
                        boxShadow: '0 14px 28px rgba(203,16,44,0.28)',
                    }}
                >
                    AI
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, position: 'relative', zIndex: 2 }}>
                    <MovingCard title="CRM" caption="lead owners and follow-ups" color={brand.red} index={0} />
                    <MovingCard title="Inbox" caption="requests and replies" color={brand.blue} index={1} />
                    <MovingCard title="Docs" caption="invoices and PDFs" color={brand.amber} index={2} />
                    <MovingCard title="Ops" caption="approvals and updates" color={brand.green} index={3} />
                </div>
                <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                    {[
                        ['manual routing', 78, brand.red],
                        ['re-entry risk', 66, brand.amber],
                        ['response lag', 84, brand.blue],
                    ].map(([label, value, color]) => (
                        <div key={label as string}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: brand.slate, fontWeight: 900, marginBottom: 8 }}>
                                <span>{label}</span>
                                <span>{value}%</span>
                            </div>
                            <div style={{ height: 9, borderRadius: 99, background: '#f0e2d9' }}>
                                <div style={{ height: '100%', width: `${interpolate(frame, [48, 150], [0, Number(value)], clamp)}%`, borderRadius: 99, background: color as string }} />
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>
            <Progress />
        </Shell>
    );
};

const AgentScene = () => {
    const frame = useCurrentFrame();
    const tasks = [
        ['Draft lead reply', 'approve', brand.amber],
        ['Flag invoice mismatch', 'escalate', brand.red],
        ['Route support ticket', 'auto-route', brand.green],
        ['Update CRM record', 'approved', brand.blue],
    ] as const;

    return (
        <Shell label="AI agent controls">
            <div style={{ position: 'absolute', left: 72, top: 130, width: 520, ...pop(0) }}>
                <Pill color={brand.amber}>Scene 3: controlled agent</Pill>
                <h2 style={{ margin: '22px 0 16px', fontSize: 58, lineHeight: 1, fontWeight: 950 }}>
                    The agent moves the queue. People approve the risky actions.
                </h2>
                <p style={{ fontSize: 28, lineHeight: 1.28, color: brand.slate, margin: 0 }}>
                    Every action has a source, a policy check, and a human gate when it matters.
                </p>
            </div>
            <Panel style={{ position: 'absolute', right: 72, top: 130, width: 590, padding: 25, ...pop(22) }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 32, fontWeight: 950 }}>Task queue</div>
                    <div style={{ padding: '10px 14px', borderRadius: 999, color: brand.green, background: '#e4f4ed', fontSize: 20, fontWeight: 950 }}>pilot live</div>
                </div>
                {tasks.map(([task, status, color], index) => {
                    const reveal = ease(frame, 38 + index * 20, 54 + index * 20);
                    const pulse = interpolate((frame + index * 9) % 50, [0, 25, 50], [1, 1.05, 1]);
                    return (
                        <div
                            key={task}
                            style={{
                                opacity: reveal,
                                transform: `translateX(${interpolate(reveal, [0, 1], [35, 0])}px) scale(${pulse})`,
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                alignItems: 'center',
                                gap: 16,
                                padding: '18px 0',
                                borderTop: index === 0 ? 'none' : `1px solid ${brand.line}`,
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 25, fontWeight: 950 }}>{task}</div>
                                <div style={{ fontSize: 18, color: brand.muted, marginTop: 5 }}>source linked, log saved</div>
                            </div>
                            <div style={{ padding: '10px 13px', borderRadius: 13, background: `${color}18`, color, fontSize: 19, fontWeight: 950 }}>
                                {status}
                            </div>
                        </div>
                    );
                })}
            </Panel>
            <Progress />
        </Shell>
    );
};

const ResultScene = () => {
    const frame = useCurrentFrame();
    const metrics = [
        ['42h', 'manual work removed', brand.red],
        ['38%', 'faster first response', brand.green],
        ['18', 'exceptions caught', brand.blue],
    ] as const;

    return (
        <Shell label="measured rollout">
            <div style={{ position: 'absolute', left: 84, right: 84, top: 130, textAlign: 'center', ...pop(0) }}>
                <Pill color={brand.green}>Scene 4: measurable pilot</Pill>
                <h2 style={{ margin: '24px auto 12px', fontSize: 68, lineHeight: 0.96, maxWidth: 1010, fontWeight: 950 }}>
                    Ship the pilot. Measure the operating result.
                </h2>
                <p style={{ margin: '0 auto', fontSize: 29, color: brand.slate, lineHeight: 1.28, maxWidth: 850 }}>
                    This is what a serious AI automation agency should prove before scaling the system.
                </p>
            </div>
            <div style={{ position: 'absolute', left: 92, right: 92, top: 388, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
                {metrics.map(([number, label, color], index) => {
                    const reveal = ease(frame, 40 + index * 20, 72 + index * 20);
                    return (
                        <Panel key={label} style={{ padding: 30, textAlign: 'center', borderTop: `8px solid ${color}`, opacity: reveal, transform: `translateY(${interpolate(reveal, [0, 1], [30, 0])}px)` }}>
                            <div style={{ fontSize: 62, fontWeight: 950, color }}>{number}</div>
                            <div style={{ marginTop: 8, fontSize: 23, color: brand.slate, fontWeight: 900 }}>{label}</div>
                        </Panel>
                    );
                })}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', ...pop(128) }}>
                <div style={{ background: brand.red, color: brand.white, borderRadius: 18, padding: '22px 34px', fontSize: 30, fontWeight: 950, boxShadow: '0 18px 44px rgba(203,16,44,0.28)' }}>
                    goexpandia.com/contact
                </div>
            </div>
            <Progress />
        </Shell>
    );
};

export const AiAutomationAgencyNearMeVideo = () => (
    <AbsoluteFill>
        <Sequence from={0} durationInFrames={150}>
            <SearchScene />
        </Sequence>
        <Sequence from={150} durationInFrames={165}>
            <WorkflowScene />
        </Sequence>
        <Sequence from={315} durationInFrames={180}>
            <AgentScene />
        </Sequence>
        <Sequence from={495} durationInFrames={165}>
            <ResultScene />
        </Sequence>
    </AbsoluteFill>
);

const Root = () => (
    <Composition
        id="AiAutomationAgencyNearMe"
        component={AiAutomationAgencyNearMeVideo}
        durationInFrames={660}
        fps={30}
        width={1280}
        height={720}
    />
);

registerRoot(Root);
