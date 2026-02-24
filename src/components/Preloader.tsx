'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

type AnimationVariant =
    | 'diagonal-wave'
    | 'scale-fade-center'
    | 'alternating-directions'
    | 'elastic-bounce'
    | 'rotate-shrink'
    | 'staggered-opacity'
    | '3d-flip'
    | 'random-scatter'
    | 'wave-morph'
    | 'curtain-close';

interface PreloaderProps {
    variant?: AnimationVariant;
}

export const Preloader: React.FC<PreloaderProps> = ({ variant = 'diagonal-wave' }) => {
    const preloaderRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const isMobile = window.innerWidth < 768;
            const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

            switch (variant) {
                case 'diagonal-wave':
                    tl.to('.preloader-item', {
                        delay: 0.3,
                        x: isMobile ? '-100%' : '100%',
                        y: isMobile ? '50%' : '-50%',
                        rotation: 45,
                        duration: 1,
                        stagger: 0.05,
                        ease: 'expo.inOut',
                    });
                    break;

                case 'scale-fade-center':
                    tl.to('.preloader-item', {
                        delay: 0.4,
                        scaleY: 0,
                        transformOrigin: 'center center',
                        duration: 0.6,
                        stagger: {
                            each: 0.06,
                            from: 'center',
                        },
                        ease: 'back.in(1.4)',
                    });
                    break;

                case 'alternating-directions':
                    tl.to('.preloader-item', {
                        delay: 0.5,
                        ...(isMobile
                            ? { x: (i) => (i % 2 === 0 ? '-100%' : '100%') }
                            : { y: (i) => (i % 2 === 0 ? '-100%' : '100%') }),
                        duration: 0.9,
                        stagger: 0.07,
                        ease: 'power4.inOut',
                    });
                    break;

                case 'elastic-bounce':
                    tl.to('.preloader-item', {
                        delay: 0.3,
                        ...(isMobile ? { x: '-120%' } : { y: '-120%' }),
                        duration: 1.2,
                        stagger: 0.04,
                        ease: 'elastic.in(1, 0.6)',
                    });
                    break;

                case 'rotate-shrink':
                    tl.to('.preloader-item', {
                        delay: 0.4,
                        scale: 0,
                        rotation: 180,
                        transformOrigin: 'center center',
                        duration: 0.8,
                        stagger: 0.06,
                        ease: 'back.in(2)',
                    });
                    break;

                case 'staggered-opacity':
                    tl.to('.preloader-item', {
                        delay: 0.5,
                        opacity: 0,
                        ...(isMobile ? { x: '-50%' } : { y: '-50%' }),
                        duration: 0.7,
                        stagger: {
                            each: 0.08,
                            from: 'edges',
                        },
                        ease: 'power3.in',
                    });
                    break;

                case '3d-flip':
                    tl.to('.preloader-item', {
                        delay: 0.4,
                        rotationY: 90,
                        opacity: 0,
                        transformOrigin: isMobile ? 'left center' : 'center top',
                        duration: 0.8,
                        stagger: 0.05,
                        ease: 'power2.in',
                    });
                    break;

                case 'random-scatter':
                    tl.to('.preloader-item', {
                        delay: 0.3,
                        x: () => gsap.utils.random(-200, 200),
                        y: () => gsap.utils.random(-200, 200),
                        rotation: () => gsap.utils.random(-180, 180),
                        scale: 0,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.04,
                        ease: 'power4.in',
                    });
                    break;

                case 'wave-morph':
                    tl.to('.preloader-item', {
                        delay: 0.5,
                        ...(isMobile
                            ? { x: '-100%', skewX: -20 }
                            : { y: '-100%', skewY: -20 }),
                        duration: 1,
                        stagger: {
                            each: 0.08,
                            ease: 'sine.inOut',
                        },
                        ease: 'power3.inOut',
                    });
                    break;

                case 'curtain-close':
                    tl.to('.preloader-item', {
                        delay: 0.4,
                        scaleX: isMobile ? 1 : 0,
                        scaleY: isMobile ? 0 : 1,
                        transformOrigin: 'center center',
                        duration: 0.8,
                        stagger: {
                            each: 0.06,
                            from: 'edges',
                        },
                        ease: 'circ.in',
                    });
                    break;
            }

            tl.to(preloaderRef.current, {
                autoAlpha: 0,
                duration: 0.4,
            });
        },
        { scope: preloaderRef, dependencies: [variant] }
    );

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col md:flex-row"
            ref={preloaderRef}
        >
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="
                    preloader-item
                    w-full h-[10%] md:h-full md:w-[10%]
                    bg-gray-800
                    "
                />
            ))}
        </div>
    );
};

// Demo component to test all variations
export const PreloaderDemo = () => {
    const [selectedVariant, setSelectedVariant] = useState<AnimationVariant>('diagonal-wave');
    const [key, setKey] = useState(0);

    const variants: { value: AnimationVariant; label: string }[] = [
        { value: 'diagonal-wave', label: 'Diagonal Wave' },
        { value: 'scale-fade-center', label: 'Scale & Fade Center' },
        { value: 'alternating-directions', label: 'Alternating Directions' },
        { value: 'elastic-bounce', label: 'Elastic Bounce' },
        { value: 'rotate-shrink', label: 'Rotate & Shrink' },
        { value: 'staggered-opacity', label: 'Staggered Opacity' },
        { value: '3d-flip', label: '3D Flip' },
        { value: 'random-scatter', label: 'Random Scatter' },
        { value: 'wave-morph', label: 'Wave Morph' },
        { value: 'curtain-close', label: 'Curtain Close' },
    ];

    const handleVariantChange = (variant: AnimationVariant) => {
        setSelectedVariant(variant);
        setKey((prev) => prev + 1); // Force remount to replay animation
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">
                    GSAP Preloader Variations
                </h1>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <label className="block text-white mb-4 font-semibold">
                        Select Animation Variant:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {variants.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => handleVariantChange(value)}
                                className={`
                                    px-4 py-3 rounded-lg font-medium transition-all
                                    ${
                                        selectedVariant === value
                                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Current: {variants.find((v) => v.value === selectedVariant)?.label}
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Click any button above to see the animation. The preloader will replay
                        automatically.
                    </p>
                    <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden">
                        <Preloader key={key} variant={selectedVariant} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-gray-600 text-lg">Content Behind Preloader</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Usage:</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                        {`<Preloader variant="${selectedVariant}" />`}
                    </pre>
                </div>
            </div>
        </div>
    );
};