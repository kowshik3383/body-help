export function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <span className="text-2xl">{icon}</span>
      <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
    </div>
  );
}


