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
    green: '#1f6f5b',
    dark: '#14231f',
    cream: '#f8f3e6',
    white: '#ffffff',
    ink: '#17211f',
    line: '#d8e5de',
};

const workflowSteps = [
    'Map local workflow',
    'Find repeatable tasks',
    'Build AI pilot',
    'Measure time saved',
];

const useEntrance = (startFrame: number) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = spring({
        frame: frame - startFrame,
        fps,
        config: {
            damping: 22,
            stiffness: 110,
            mass: 0.8,
        },
    });

    return {
        opacity: interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }),
        transform: `translateY(${interpolate(progress, [0, 1], [34, 0])}px) scale(${interpolate(progress, [0, 1], [0.98, 1])})`,
    };
};

const Background = () => {
    const frame = useCurrentFrame();
    const drift = interpolate(frame, [0, 630], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${brand.cream} 0%, #eef7f1 44%, #ffffff 100%)`,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: 520,
                    height: 520,
                    borderRadius: 999,
                    background: 'rgba(31, 111, 91, 0.12)',
                    top: 70 + drift * 28,
                    right: -120,
                    filter: 'blur(20px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: 360,
                    height: 360,
                    borderRadius: 999,
                    background: 'rgba(20, 35, 31, 0.08)',
                    left: -90,
                    bottom: -70 + drift * 20,
                    filter: 'blur(18px)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 54,
                    border: `1px solid ${brand.line}`,
                    borderRadius: 28,
                }}
            />
        </AbsoluteFill>
    );
};

const Badge = ({ text }: { text: string }) => (
    <div
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            borderRadius: 999,
            background: 'rgba(31, 111, 91, 0.1)',
            color: brand.green,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 0,
            width: 'fit-content',
        }}
    >
        <span
            style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: brand.green,
            }}
        />
        {text}
    </div>
);

const WorkflowCard = ({ step, index }: { step: string; index: number }) => {
    const frame = useCurrentFrame();
    const active = interpolate(frame, [190 + index * 35, 215 + index * 35], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                background: brand.white,
                border: `2px solid ${active > 0.5 ? brand.green : brand.line}`,
                boxShadow: active > 0.5 ? '0 24px 56px rgba(31, 111, 91, 0.18)' : '0 12px 36px rgba(20, 35, 31, 0.08)',
                borderRadius: 20,
                padding: 26,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                transform: `scale(${interpolate(active, [0, 1], [1, 1.04])})`,
            }}
        >
            <div
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: active > 0.5 ? brand.green : '#edf5f1',
                    color: active > 0.5 ? brand.white : brand.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 900,
                }}
            >
                {index + 1}
            </div>
            <div style={{ fontSize: 31, fontWeight: 900, color: brand.ink }}>{step}</div>
        </div>
    );
};

const HeroScene = () => {
    const titleStyle = useEntrance(0);
    const subtitleStyle = useEntrance(18);
    const panelStyle = useEntrance(38);

    return (
        <AbsoluteFill style={{ padding: 86, justifyContent: 'center' }}>
            <div style={titleStyle}>
                <Badge text="AI automation agency near me" />
                <h1
                    style={{
                        margin: '26px 0 16px',
                        fontSize: 82,
                        lineHeight: 0.94,
                        fontWeight: 950,
                        color: brand.dark,
                        maxWidth: 840,
                        letterSpacing: 0,
                    }}
                >
                    Local workflow context. Enterprise AI execution.
                </h1>
            </div>
            <p
                style={{
                    ...subtitleStyle,
                    fontSize: 34,
                    lineHeight: 1.25,
                    maxWidth: 760,
                    color: 'rgba(20, 35, 31, 0.72)',
                    margin: 0,
                }}
            >
                Choose a partner that maps the real process, builds a safe pilot, and measures what changed.
            </p>
            <div
                style={{
                    ...panelStyle,
                    position: 'absolute',
                    right: 86,
                    bottom: 86,
                    width: 430,
                    background: brand.white,
                    border: `1px solid ${brand.line}`,
                    borderRadius: 24,
                    padding: 30,
                    boxShadow: '0 30px 70px rgba(20, 35, 31, 0.12)',
                }}
            >
                <div style={{ fontSize: 24, color: brand.green, fontWeight: 900, marginBottom: 12 }}>First pilot</div>
                <div style={{ fontSize: 52, color: brand.dark, fontWeight: 950 }}>2-6 weeks</div>
                <div style={{ fontSize: 22, color: 'rgba(20, 35, 31, 0.62)', marginTop: 8 }}>Discovery, build, test, launch.</div>
            </div>
        </AbsoluteFill>
    );
};

const WorkflowScene = () => {
    const heading = useEntrance(155);

    return (
        <AbsoluteFill style={{ padding: 78 }}>
            <div style={heading}>
                <Badge text="What the agency should do" />
                <h2
                    style={{
                        margin: '22px 0 34px',
                        fontSize: 58,
                        lineHeight: 1,
                        fontWeight: 950,
                        color: brand.dark,
                        letterSpacing: 0,
                    }}
                >
                    Turn messy business operations into usable AI systems.
                </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                {workflowSteps.map((step, index) => (
                    <WorkflowCard key={step} step={step} index={index} />
                ))}
            </div>
        </AbsoluteFill>
    );
};

const UseCasesScene = () => {
    const frame = useCurrentFrame();
    const heading = useEntrance(305);
    const items = ['Lead qualification', 'Support triage', 'Invoice checks', 'Reporting', 'CRM cleanup', 'AI agents'];

    return (
        <AbsoluteFill style={{ padding: 78 }}>
            <div style={heading}>
                <Badge text="Automate first where value is obvious" />
                <h2
                    style={{
                        margin: '22px 0 34px',
                        fontSize: 58,
                        lineHeight: 1,
                        fontWeight: 950,
                        color: brand.dark,
                        letterSpacing: 0,
                    }}
                >
                    Start with repeatable work, clear rules, and measurable cost.
                </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {items.map((item, index) => {
                    const progress = interpolate(frame, [340 + index * 12, 362 + index * 12], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                    });
                    return (
                        <div
                            key={item}
                            style={{
                                minHeight: 116,
                                background: brand.white,
                                border: `1px solid ${brand.line}`,
                                borderRadius: 22,
                                padding: 26,
                                boxShadow: '0 16px 42px rgba(20, 35, 31, 0.08)',
                                opacity: progress,
                                transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px)`,
                            }}
                        >
                            <div style={{ fontSize: 30, fontWeight: 950, color: brand.ink }}>{item}</div>
                            <div style={{ height: 8, borderRadius: 99, background: '#e8f3ee', marginTop: 18 }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${interpolate(progress, [0, 1], [0, 78 + index * 3])}%`,
                                        borderRadius: 99,
                                        background: brand.green,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

const ClosingScene = () => {
    const frame = useCurrentFrame();
    const heading = useEntrance(455);
    const pulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.96, 1.04]);

    return (
        <AbsoluteFill style={{ padding: 86, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={heading}>
                <Badge text="Go Expandia" />
                <h2
                    style={{
                        margin: '28px auto 18px',
                        fontSize: 74,
                        lineHeight: 0.96,
                        fontWeight: 950,
                        color: brand.dark,
                        maxWidth: 960,
                        letterSpacing: 0,
                    }}
                >
                    Build the first AI automation pilot with a practical agency model.
                </h2>
                <p
                    style={{
                        fontSize: 32,
                        lineHeight: 1.35,
                        color: 'rgba(20, 35, 31, 0.7)',
                        maxWidth: 840,
                        margin: '0 auto 38px',
                    }}
                >
                    Automation, consulting, AI agents, and custom AI solutions for businesses.
                </p>
                <div
                    style={{
                        display: 'inline-flex',
                        padding: '24px 34px',
                        borderRadius: 20,
                        background: brand.green,
                        color: brand.white,
                        fontSize: 30,
                        fontWeight: 950,
                        transform: `scale(${pulse})`,
                        boxShadow: '0 22px 60px rgba(31, 111, 91, 0.25)',
                    }}
                >
                    goexpandia.com/contact
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const AiAutomationAgencyNearMeVideo = () => (
    <AbsoluteFill style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <Background />
        <Sequence from={0} durationInFrames={150}>
            <HeroScene />
        </Sequence>
        <Sequence from={150} durationInFrames={150}>
            <WorkflowScene />
        </Sequence>
        <Sequence from={300} durationInFrames={150}>
            <UseCasesScene />
        </Sequence>
        <Sequence from={450} durationInFrames={180}>
            <ClosingScene />
        </Sequence>
    </AbsoluteFill>
);

const Root = () => (
    <Composition
        id="AiAutomationAgencyNearMe"
        component={AiAutomationAgencyNearMeVideo}
        durationInFrames={630}
        fps={30}
        width={1280}
        height={720}
    />
);

registerRoot(Root);
