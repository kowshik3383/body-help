'use client';

import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Image from "next/image";

export function WelcomeScreen({
	onNext,
	step,
	total,
}: {
	onNext: () => void;
	step: number;
	total: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.6 }}
			className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-[#201604] dark:via-[#2a1c06] dark:to-[#160f02]"
		>
			{/* Subtle background */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.03),rgba(255,255,255,0))]" />

			{/* Optional: Keep your background image but more subtle */}
		

			{/* Content container */}
			<div className="relative w-full max-w-xl mx-auto px-6 py-12">
				{/* Minimal step indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
					className="flex items-center justify-between mb-16"
				>
					<div className="flex gap-1">
						{Array.from({ length: total }).map((_, i) => (
							<div
								key={i}
								className={`h-0.5 rounded-full transition-all duration-700 ${i < step
										? 'w-8 bg-slate-900 dark:bg-white'
										: 'w-8 bg-white dark:bg-slate-800'
									}`}
							/>
						))}
					</div>
					<span className="text-xs tabular-nums text-slate-400 dark:text-slate-600">
						{step}/{total}
					</span>
				</motion.div>

				{/* Main content */}
				<div className="space-y-12">
					{/* Title */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-4"
					>
						<h1 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-white">
							Welcome to
							<span className="block mt-2 font-normal">Diagnova</span>
						</h1>

						<p className="text-lg text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-md">
							Your personal AI-powered health companion
						</p>
					</motion.div>

					{/* Simple feature list */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-3"
					>
						{[
							"AI-powered health insights",
							"Secure and private",
							"Instant personalized results",
						].map((feature, i) => (
							<div
								key={i}
								className="flex items-center gap-3 text-slate-600 dark:text-slate-400"
							>
								<div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
								<span className="text-sm font-light">{feature}</span>
							</div>
						))}
					</motion.div>

					{/* CTA */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="space-y-4 pt-4"
					>
						<button
							onClick={onNext}
							className="group w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] flex items-center justify-center gap-2"
						>
							Start Your Assessment
							<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
						</button>

						{/* Privacy note */}
						<p className="text-xs text-slate-400 dark:text-slate-600 flex items-center justify-center gap-2">
							<Lock className="w-3 h-3" />
							<span>Your data is encrypted and private</span>
						</p>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}