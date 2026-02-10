"use client";

import React, { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
  description: string;
  difficulty: string;
  category: string;
}

interface Props {
  bodyPart: string;
}

const bodyPartMap: Record<string, string> = {
  head: "neck",
  brain: "neck",
  shoulder: "shoulders",
  arm: "upper arms",
  forearm: "lower arms",
  chest: "chest",
  abdomen: "waist",
  stomach: "waist",
  thigh: "upper legs",
  leg: "upper legs",
  calf: "lower legs",
  back: "back",
  neck: "neck",
};

const validParts = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];

const ExerciseComponent: React.FC<Props> = ({ bodyPart }) => {
  const [equipmentMode, setEquipmentMode] = useState<
    "equipment" | "no-equipment" | null
  >(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const RAPID_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
  const RAPID_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST!;

  // 🔥 Fetch Image as Blob (Resolution 720 mandatory)
  const fetchExerciseImage = async (exerciseId: string) => {
    try {
      const res = await fetch(
        `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=720`,
        {
          headers: {
            "X-RapidAPI-Key": RAPID_KEY,
            "X-RapidAPI-Host": RAPID_HOST,
          },
        }
      );

      if (!res.ok) throw new Error("Image fetch failed");

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImages((prev) => ({
        ...prev,
        [exerciseId]: imageUrl,
      }));
    } catch (err) {
      console.error("Image error:", err);
    }
  };

  const fetchExercises = async (mode: "equipment" | "no-equipment") => {
    try {
      setLoading(true);
      setError("");
      setExercises([]);
      setImages({});

      const mappedBodyPart =
        bodyPartMap[bodyPart.toLowerCase()] || bodyPart.toLowerCase();

      if (!validParts.includes(mappedBodyPart)) {
        setError("No exercises available for this body part.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${mappedBodyPart}`,
        {
          headers: {
            "X-RapidAPI-Key": RAPID_KEY,
            "X-RapidAPI-Host": RAPID_HOST,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch exercises");

      const data: Exercise[] = await res.json();

      const filtered =
        mode === "no-equipment"
          ? data.filter((ex) => ex.equipment === "body weight")
          : data.filter((ex) => ex.equipment !== "body weight");

      const limited = filtered.slice(0, 12);

      setExercises(limited);

      // 🔥 Fetch images in parallel
      limited.forEach((exercise) => {
        fetchExerciseImage(exercise.id);
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching exercises.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = (mode: "equipment" | "no-equipment") => {
    setEquipmentMode(mode);
    fetchExercises(mode);
  };

  const reset = () => {
    setEquipmentMode(null);
    setExercises([]);
    setImages({});
    setError("");
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {!equipmentMode && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md text-center border">
          <h2 className="text-xl font-bold mb-3 capitalize">
            Exercises for {bodyPart}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Do you want exercises with equipment or without equipment?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSelection("equipment")}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              With Equipment
            </button>

            <button
              onClick={() => handleSelection("no-equipment")}
              className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
            >
              No Equipment
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500">Loading exercises...</div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && exercises.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold capitalize">
              {equipmentMode === "no-equipment"
                ? "Bodyweight Exercises"
                : "Equipment Exercises"}
            </h3>

            <button
              onClick={reset}
              className="text-sm text-blue-600 hover:underline"
            >
              Change Option
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition border"
              >
                <h4 className="font-semibold mb-2 text-sm capitalize">
                  {exercise.name}
                </h4>

                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {images[exercise.id] ? (
                    <img
                      src={images[exercise.id]}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Loading image...</span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2 capitalize">
                  Target: {exercise.target}
                </p>

                <p className="text-xs text-gray-500 capitalize">
                  Equipment: {exercise.equipment}
                </p>

                <details className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <summary className="cursor-pointer font-medium">
                    View Instructions
                  </summary>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {exercise.instructions?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseComponent;
