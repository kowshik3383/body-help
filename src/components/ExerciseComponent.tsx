"use client";

import React, { useState, useEffect } from "react";

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
  bodyPart?: string;
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

const ExerciseComponent: React.FC<Props> = ({ bodyPart: initialBodyPart }) => {
  const [bodyPartList, setBodyPartList] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(
    initialBodyPart || null
  );
  const [equipmentMode, setEquipmentMode] = useState<
    "equipment" | "no-equipment" | null
  >(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingBodyParts, setLoadingBodyParts] = useState(false);
  const [error, setError] = useState("");

  const RAPID_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY!;
  const RAPID_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST!;

  // Fetch body part list on mount if no body part provided
  useEffect(() => {
    if (!initialBodyPart) {
      fetchBodyPartList();
    }
  }, [initialBodyPart]);

  const fetchBodyPartList = async () => {
    try {
      setLoadingBodyParts(true);
      const res = await fetch(
        "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
        {
          headers: {
            "X-RapidAPI-Key": RAPID_KEY,
            "X-RapidAPI-Host": RAPID_HOST,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch body parts");

      const data: string[] = await res.json();
      setBodyPartList(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load body parts");
    } finally {
      setLoadingBodyParts(false);
    }
  };

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

  const fetchExercises = async (
    mode: "equipment" | "no-equipment",
    bodyPart: string
  ) => {
    try {
      setLoading(true);
      setError("");
      setExercises([]);
      setImages({});

      const mappedBodyPart =
        bodyPartMap[bodyPart.toLowerCase()] || bodyPart.toLowerCase();

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

      if (filtered.length === 0) {
        setError(
          `No ${mode === "no-equipment" ? "bodyweight" : "equipment"} exercises found for this body part.`
        );
        setLoading(false);
        return;
      }

      const limited = filtered.slice(0, 12);
      setExercises(limited);

      limited.forEach((exercise) => {
        fetchExerciseImage(exercise.id);
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch exercises. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBodyPartSelection = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    setEquipmentMode(null);
    setExercises([]);
    setImages({});
    setError("");
  };

  const handleEquipmentSelection = (mode: "equipment" | "no-equipment") => {
    if (!selectedBodyPart) return;
    setEquipmentMode(mode);
    fetchExercises(mode, selectedBodyPart);
  };

  const reset = () => {
    if (initialBodyPart) {
      setEquipmentMode(null);
      setExercises([]);
      setImages({});
      setError("");
    } else {
      setSelectedBodyPart(null);
      setEquipmentMode(null);
      setExercises([]);
      setImages({});
      setError("");
    }
  };

  // Body Part Selection Screen
  if (!selectedBodyPart && !initialBodyPart) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-2">
              Exercise Finder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select a body part to get started
            </p>
          </div>

          {loadingBodyParts ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 dark:border-gray-100 border-r-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {bodyPartList.map((part) => (
                <button
                  key={part}
                  onClick={() => handleBodyPartSelection(part)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 md:p-6 text-center hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-200 hover:shadow-md"
                >
                  <span className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {part}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Equipment Selection Screen
  if (selectedBodyPart && !equipmentMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {!initialBodyPart && (
            <button
              onClick={reset}
              className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← Back to body parts
            </button>
          )}

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100 mb-2 capitalize">
              {selectedBodyPart}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Choose your workout preference
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleEquipmentSelection("equipment")}
                className="px-8 py-3 rounded-lg border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-200 font-medium"
              >
                With Equipment
              </button>

              <button
                onClick={() => handleEquipmentSelection("no-equipment")}
                className="px-8 py-3 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                No Equipment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exercises Display
  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-gray-100 capitalize">
              {selectedBodyPart}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {equipmentMode === "no-equipment"
                ? "Bodyweight exercises"
                : "Equipment-based exercises"}
            </p>
          </div>

          <button
            onClick={reset}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-gray-900 dark:border-gray-100 border-r-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading exercises...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 ">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={reset}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : exercises.length > 0 ? (
          <div className="grid grid-cols-1  gap-4 md:gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {images[exercise.id] ? (
                    <img
                      src={images[exercise.id]}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gray-400 border-r-transparent"></div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 capitalize leading-tight">
                    {exercise.name}
                  </h3>

                  <div className="space-y-1 mb-3 text-xs text-gray-600 dark:text-gray-400">
                    <p className="capitalize">
                      <span className="font-medium">Target:</span>{" "}
                      {exercise.target}
                    </p>
                    <p className="capitalize">
                      <span className="font-medium">Equipment:</span>{" "}
                      {exercise.equipment}
                    </p>
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer text-xs font-medium text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors list-none flex items-center justify-between">
                      <span>Instructions</span>
                      <span className="group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <ol className="list-decimal pl-4 mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {exercise.instructions?.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              </div>
            ))}
          </div>
        ) : null}
<div className="h-44"></div>
      </div>
    </div>
  );
};

export default ExerciseComponent;