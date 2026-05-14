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
};

const clamp = {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
};

const ease = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [0, 1], clamp);

const usePop = (start: number, distance = 28) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const value = spring({
        frame: frame - start,
        fps,
        config: { damping: 20, stiffness: 160, mass: 0.78 },
    });

    return {
        opacity: ease(frame, start, start + 16),
        transform: `translateY(${interpolate(value, [0, 1], [distance, 0])}px) scale(${interpolate(value, [0, 1], [0.97, 1])})`,
    };
};

const Layout = ({ children, eyebrow }: { children: React.ReactNode; eyebrow: string }) => {
    const frame = useCurrentFrame();
    const drift = interpolate(frame, [0, 540], [0, 34], clamp);

    return (
        <AbsoluteFill
            style={{
                background: brand.cream,
                backgroundImage:
                    'linear-gradient(135deg, rgba(203,16,44,0.08) 0%, rgba(255,255,255,0) 42%), linear-gradient(rgba(20,27,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(20,27,42,0.045) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 46px 46px, 46px 46px',
                backgroundPosition: `0 0, ${-drift}px ${-drift * 0.7}px, ${-drift}px ${-drift * 0.7}px`,
                color: brand.ink,
                fontFamily: 'Inter, Arial, sans-serif',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 34,
                    left: 52,
                    right: 52,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        border: `1px solid ${brand.line}`,
                        background: 'rgba(255,255,255,0.84)',
                        padding: '11px 18px',
                        borderRadius: 999,
                        color: brand.slate,
                        fontSize: 19,
                        fontWeight: 900,
                    }}
                >
                    {eyebrow}
                </div>
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: 52,
                    right: 52,
                    bottom: 30,
                    height: 7,
                    borderRadius: 99,
                    background: '#efdfd6',
                    overflow: 'hidden',
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        width: `${interpolate(frame, [0, 539], [0, 100], clamp)}%`,
                        height: '100%',
                        background: brand.red,
                        borderRadius: 99,
                    }}
                />
            </div>
            {children}
        </AbsoluteFill>
    );
};

const Label = ({ children, tone = brand.red }: { children: React.ReactNode; tone?: string }) => (
    <div
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            width: 'fit-content',
            borderRadius: 999,
            background: `${tone}17`,
            border: `1px solid ${tone}36`,
            color: tone,
            padding: '11px 17px',
            fontSize: 21,
            fontWeight: 950,
        }}
    >
        <span style={{ width: 9, height: 9, borderRadius: 99, background: tone }} />
        {children}
    </div>
);

const BigNumber = ({ value, color }: { value: string; color: string }) => (
    <div
        style={{
            width: 92,
            height: 92,
            borderRadius: 24,
            background: color,
            color: brand.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 46,
            fontWeight: 950,
            boxShadow: `0 18px 42px ${color}33`,
        }}
    >
        {value}
    </div>
);

const MarketingScene = ({
    eyebrow,
    step,
    question,
    answer,
    color,
    children,
}: {
    eyebrow: string;
    step: string;
    question: string;
    answer: string;
    color: string;
    children: React.ReactNode;
}) => (
    <Layout eyebrow={eyebrow}>
        <div style={{ position: 'absolute', left: 84, top: 142, width: 660, ...usePop(0) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <BigNumber value={step} color={color} />
                <Label tone={color}>AI automation agency</Label>
            </div>
            <h1
                style={{
                    margin: '34px 0 22px',
                    fontSize: 76,
                    lineHeight: 0.94,
                    fontWeight: 950,
                    maxWidth: 700,
                }}
            >
                {question}
            </h1>
            <p
                style={{
                    margin: 0,
                    fontSize: 34,
                    lineHeight: 1.22,
                    color: brand.slate,
                    fontWeight: 760,
                    maxWidth: 665,
                }}
            >
                {answer}
            </p>
        </div>
        {children}
    </Layout>
);

const DefinitionVisual = () => {
    const frame = useCurrentFrame();
    const items = [
        ['Repetitive work', brand.blue],
        ['AI workflows', brand.red],
        ['Time saved', brand.green],
    ] as const;

    return (
        <div style={{ position: 'absolute', right: 74, top: 166, width: 430, height: 390 }}>
            {items.map(([label, color], index) => {
                const reveal = ease(frame, 28 + index * 14, 50 + index * 14);
                const y = index * 116;
                return (
                    <div
                        key={label}
                        style={{
                            position: 'absolute',
                            left: index === 1 ? 34 : 0,
                            top: y,
                            width: 395,
                            padding: '24px 26px',
                            borderRadius: 22,
                            background: brand.white,
                            border: `2px solid ${color}35`,
                            boxShadow: '0 20px 46px rgba(20,27,42,0.12)',
                            opacity: reveal,
                            transform: `translateX(${interpolate(reveal, [0, 1], [42, 0])}px)`,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ width: 20, height: 20, borderRadius: 7, background: color }} />
                            <span style={{ fontSize: 28, fontWeight: 950 }}>{label}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const StartVisual = () => {
    const frame = useCurrentFrame();
    const steps = [
        ['Map', 'one workflow'],
        ['Pick', 'one use case'],
        ['Launch', 'one pilot'],
    ] as const;

    return (
        <div style={{ position: 'absolute', right: 70, top: 154, width: 460, height: 430 }}>
            <div
                style={{
                    position: 'absolute',
                    left: 82,
                    top: 62,
                    bottom: 62,
                    width: 6,
                    borderRadius: 99,
                    background: '#eaded5',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: 82,
                    top: 62,
                    width: 6,
                    height: `${interpolate(frame, [24, 145], [0, 306], clamp)}px`,
                    borderRadius: 99,
                    background: brand.red,
                }}
            />
            {steps.map(([title, caption], index) => {
                const reveal = ease(frame, 28 + index * 28, 54 + index * 28);
                return (
                    <div
                        key={title}
                        style={{
                            position: 'absolute',
                            top: 28 + index * 128,
                            left: 0,
                            right: 0,
                            display: 'grid',
                            gridTemplateColumns: '88px 1fr',
                            gap: 24,
                            alignItems: 'center',
                            opacity: reveal,
                            transform: `translateY(${interpolate(reveal, [0, 1], [28, 0])}px)`,
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 22,
                                background: index === 2 ? brand.red : brand.white,
                                border: `2px solid ${index === 2 ? brand.red : brand.line}`,
                                color: index === 2 ? brand.white : brand.red,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 30,
                                fontWeight: 950,
                                boxShadow: '0 18px 42px rgba(20,27,42,0.12)',
                            }}
                        >
                            {index + 1}
                        </div>
                        <div
                            style={{
                                padding: '20px 22px',
                                borderRadius: 22,
                                background: brand.white,
                                border: `1px solid ${brand.line}`,
                                boxShadow: '0 18px 42px rgba(20,27,42,0.10)',
                            }}
                        >
                            <div style={{ fontSize: 31, fontWeight: 950 }}>{title}</div>
                            <div style={{ marginTop: 4, fontSize: 22, color: brand.slate, fontWeight: 800 }}>{caption}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const CtaScene = () => {
    const frame = useCurrentFrame();
    const pulse = interpolate(frame % 54, [0, 27, 54], [1, 1.035, 1]);

    return (
        <Layout eyebrow="next step">
            <div style={{ position: 'absolute', inset: '120px 82px 82px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: 1020, textAlign: 'center', ...usePop(0, 18) }}>
                    <Label tone={brand.red}>Start with one high-value workflow</Label>
                    <h1
                        style={{
                            margin: '30px auto 22px',
                            fontSize: 82,
                            lineHeight: 0.94,
                            fontWeight: 950,
                            maxWidth: 1020,
                        }}
                    >
                        Ready to automate the work slowing your team down?
                    </h1>
                    <p
                        style={{
                            margin: '0 auto 34px',
                            fontSize: 33,
                            lineHeight: 1.22,
                            color: brand.slate,
                            fontWeight: 760,
                            maxWidth: 820,
                        }}
                    >
                        Book an AI automation call and we will identify the first pilot worth building.
                    </p>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px 40px',
                            borderRadius: 20,
                            background: brand.red,
                            color: brand.white,
                            fontSize: 34,
                            fontWeight: 950,
                            transform: `scale(${pulse})`,
                            boxShadow: '0 24px 56px rgba(203,16,44,0.30)',
                        }}
                    >
                        goexpandia.com/contact
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const SceneOne = () => (
    <MarketingScene
        eyebrow="quick answer"
        step="1"
        question="What is an AI Automation Agency?"
        answer="A partner that finds repetitive work, connects your tools, and builds AI workflows that save time."
        color={brand.red}
    >
        <DefinitionVisual />
    </MarketingScene>
);

const SceneTwo = () => (
    <MarketingScene
        eyebrow="starting point"
        step="2"
        question="How can we start?"
        answer="We map one workflow, choose one high-value use case, and launch a focused pilot in weeks."
        color={brand.blue}
    >
        <StartVisual />
    </MarketingScene>
);

export const AiAutomationAgencyNearMeVideo = () => (
    <AbsoluteFill>
        <Sequence from={0} durationInFrames={180}>
            <SceneOne />
        </Sequence>
        <Sequence from={180} durationInFrames={180}>
            <SceneTwo />
        </Sequence>
        <Sequence from={360} durationInFrames={180}>
            <CtaScene />
        </Sequence>
    </AbsoluteFill>
);

const Root = () => (
    <Composition
        id="AiAutomationAgencyNearMe"
        component={AiAutomationAgencyNearMeVideo}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
    />
);

registerRoot(Root);
